// Vanilla JS Liquid Glass Effect - Interactive visual effect for web pages
// Created by Shu Ding (https://github.com/shuding/liquid-glass) in 2025.
// This creates a draggable glass-like element that distorts the background content

(function() {
  'use strict';
  
  // Check if liquid glass already exists and destroy it to prevent duplicates
  if (window.liquidGlass) {
    window.liquidGlass.destroy();
    console.log('Previous liquid glass effect removed.');
  }
  
  // Mathematical utility functions for shader calculations
  
  // Smooth interpolation function - creates smooth transitions between values
  // Used for creating natural-looking visual effects without harsh edges
  function smoothStep(a, b, t) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);  // Hermite interpolation formula
  }

  // Calculate Euclidean distance - fundamental for 2D graphics calculations
  function length(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  // Signed Distance Function for rounded rectangles
  // Returns the distance from a point to the edge of a rounded rectangle
  // Negative values = inside shape, positive = outside, zero = on edge
  function roundedRectSDF(x, y, width, height, radius) {
    const qx = Math.abs(x) - width + radius;
    const qy = Math.abs(y) - height + radius;
    return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
  }

  // Texture coordinate helper - represents a point in UV coordinate space
  function texture(x, y) {
    return { type: 't', x, y };
  }

  // Generate unique identifiers to prevent conflicts with multiple instances
  function generateId() {
    return 'liquid-glass-' + Math.random().toString(36).substr(2, 9);
  }

  // Main Shader class - handles the liquid glass visual effect
  // This class manages the entire lifecycle of the glass effect including:
  // - SVG filter creation for displacement mapping
  // - Canvas-based displacement map generation
  // - Mouse interaction and dragging
  // - Real-time shader calculations
  class Shader {
    constructor(options = {}) {
      // Visual properties of the glass element
      this.width = options.width || 100;
      this.height = options.height || 100;
      
      // Fragment shader function - defines how each pixel is displaced
      // This function is called for every pixel to calculate distortion
      this.fragment = options.fragment || ((uv) => texture(uv.x, uv.y));
      
      this.canvasDPI = 1;  // Device pixel ratio for sharp rendering
      this.id = generateId();  // Unique identifier for SVG elements
      this.offset = 10; // Viewport boundary offset to prevent edge clipping
      
      // Mouse tracking for interactive effects
      this.mouse = { x: 0, y: 0 };
      this.mouseUsed = false;  // Flag to track if shader uses mouse input
      
      // Initialize the visual element and its behavior
      this.createElement();
      this.setupEventListeners();
      this.updateShader();
    }

    createElement() {
      // Create the main glass container element
      // This div acts as the visible glass surface that users can interact with
      this.container = document.createElement('div');
      this.container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: ${this.width}px;
        height: ${this.height}px;
        overflow: hidden;
        border-radius: 150px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15);
        cursor: grab;
        backdrop-filter: url(#${this.id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1);
        z-index: 9999;
        pointer-events: auto;
      `;

      // Create SVG element to hold the displacement filter
      // SVG filters are used to create the glass distortion effect
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      this.svg.setAttribute('width', '0');
      this.svg.setAttribute('height', '0');
      this.svg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9998;
      `;

      // Create SVG filter definition for displacement mapping
      // This filter will distort the background content to create the glass effect
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', `${this.id}_filter`);
      filter.setAttribute('filterUnits', 'userSpaceOnUse');
      filter.setAttribute('colorInterpolationFilters', 'sRGB');
      filter.setAttribute('x', '0');
      filter.setAttribute('y', '0');
      filter.setAttribute('width', this.width.toString());
      filter.setAttribute('height', this.height.toString());

      // feImage element - references the canvas-generated displacement map
      this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
      this.feImage.setAttribute('id', `${this.id}_map`);
      this.feImage.setAttribute('width', this.width.toString());
      this.feImage.setAttribute('height', this.height.toString());

      // feDisplacementMap - applies the actual distortion effect
      // Red channel controls X displacement, Green channel controls Y displacement
      this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
      this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);
      this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
      this.feDisplacementMap.setAttribute('yChannelSelector', 'G');

      filter.appendChild(this.feImage);
      filter.appendChild(this.feDisplacementMap);
      defs.appendChild(filter);
      this.svg.appendChild(defs);

      // Create hidden canvas for generating the displacement map
      // This canvas renders the pixel data that drives the distortion effect
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width * this.canvasDPI;
      this.canvas.height = this.height * this.canvasDPI;
      this.canvas.style.display = 'none';  // Hidden from user view

      this.context = this.canvas.getContext('2d');
    }

    // Constrain glass position within viewport boundaries
    // Prevents the glass from being dragged outside the visible area
    constrainPosition(x, y) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate boundaries with offset to prevent edge clipping
      const minX = this.offset;
      const maxX = viewportWidth - this.width - this.offset;
      const minY = this.offset;
      const maxY = viewportHeight - this.height - this.offset;
      
      // Constrain position within calculated boundaries
      const constrainedX = Math.max(minX, Math.min(maxX, x));
      const constrainedY = Math.max(minY, Math.min(maxY, y));
      
      return { x: constrainedX, y: constrainedY };
    }

    setupEventListeners() {
      // Drag and drop functionality for the glass element
      let isDragging = false;
      let startX, startY, initialX, initialY;

      // Mouse down - initiate dragging
      this.container.addEventListener('mousedown', (e) => {
        isDragging = true;
        this.container.style.cursor = 'grabbing';  // Visual feedback for dragging
        startX = e.clientX;
        startY = e.clientY;
        
        // Store initial position for calculating relative movement
        const rect = this.container.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        e.preventDefault();  // Prevent text selection during drag
      });

      // Mouse move - handle dragging and mouse tracking
      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          // Calculate movement delta from drag start position
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;
          
          // Calculate new position based on initial position + delta
          const newX = initialX + deltaX;
          const newY = initialY + deltaY;
          
          // Constrain position within viewport bounds to prevent off-screen dragging
          const constrained = this.constrainPosition(newX, newY);
          
          // Apply new position and remove centering transform
          this.container.style.left = constrained.x + 'px';
          this.container.style.top = constrained.y + 'px';
          this.container.style.transform = 'none';
        }

        // Update mouse position for shader calculations (normalized 0-1 coordinates)
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = (e.clientX - rect.left) / rect.width;
        this.mouse.y = (e.clientY - rect.top) / rect.height;
        
        // Only update shader if it actually uses mouse input (performance optimization)
        if (this.mouseUsed) {
          this.updateShader();
        }
      });

      // Mouse up - end dragging
      document.addEventListener('mouseup', () => {
        isDragging = false;
        this.container.style.cursor = 'grab';  // Reset cursor to default grab state
      });

      // Handle window resize to maintain position constraints
      // Ensures glass stays within bounds when viewport size changes
      window.addEventListener('resize', () => {
        const rect = this.container.getBoundingClientRect();
        const constrained = this.constrainPosition(rect.left, rect.top);
        
        // Reposition glass if it's now outside the new viewport bounds
        if (rect.left !== constrained.x || rect.top !== constrained.y) {
          this.container.style.left = constrained.x + 'px';
          this.container.style.top = constrained.y + 'px';
          this.container.style.transform = 'none';
        }
      });
    }

    // Core shader update function - generates the displacement map
    // This is where the magic happens: converting mathematical functions into visual distortion
    updateShader() {
      // Create a proxy to track mouse usage for performance optimization
      // Only updates when mouse input is actually needed by the shader
      const mouseProxy = new Proxy(this.mouse, {
        get: (target, prop) => {
          this.mouseUsed = true;  // Flag that mouse input is being used
          return target[prop];
        }
      });

      this.mouseUsed = false;  // Reset usage flag

      // Calculate canvas dimensions with DPI scaling for sharp rendering
      const w = this.width * this.canvasDPI;
      const h = this.height * this.canvasDPI;
      
      // Create pixel data array (RGBA format: 4 bytes per pixel)
      const data = new Uint8ClampedArray(w * h * 4);

      let maxScale = 0;        // Track maximum displacement for normalization
      const rawValues = [];    // Store raw displacement values before normalization

      // Process each pixel to calculate displacement vectors
      for (let i = 0; i < data.length; i += 4) {
        // Convert linear pixel index to 2D coordinates
        const x = (i / 4) % w;
        const y = Math.floor(i / 4 / w);
        
        // Call fragment shader function with normalized UV coordinates (0-1)
        const pos = this.fragment(
          { x: x / w, y: y / h },  // Current pixel UV coordinates
          mouseProxy               // Mouse position (if used by shader)
        );
        
        // Calculate displacement vectors (how far each pixel should move)
        const dx = pos.x * w - x;  // X displacement in pixels
        const dy = pos.y * h - y;  // Y displacement in pixels
        
        // Track maximum displacement for proper scaling
        maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
        rawValues.push(dx, dy);
      }

      // Scale down maximum displacement to prevent over-distortion
      maxScale *= 0.5;

      // Convert displacement values to RGB color data for the displacement map
      // Red channel = X displacement, Green channel = Y displacement
      let index = 0;
      for (let i = 0; i < data.length; i += 4) {
        // Normalize displacement values to 0-1 range and convert to 0-255
        const r = rawValues[index++] / maxScale + 0.5;  // X displacement
        const g = rawValues[index++] / maxScale + 0.5;  // Y displacement
        
        data[i] = r * 255;      // Red channel (X displacement)
        data[i + 1] = g * 255;  // Green channel (Y displacement)
        data[i + 2] = 0;        // Blue channel (unused)
        data[i + 3] = 255;      // Alpha channel (fully opaque)
      }

      // Render the displacement map to canvas and update SVG filter
      this.context.putImageData(new ImageData(data, w, h), 0, 0);
      this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.canvas.toDataURL());
      this.feDisplacementMap.setAttribute('scale', (maxScale / this.canvasDPI).toString());
    }

    // Add the glass element to a parent container (usually document.body)
    appendTo(parent) {
      parent.appendChild(this.svg);        // Add SVG filter definitions
      parent.appendChild(this.container);  // Add visible glass container
    }

    // Clean up and remove the glass effect from the page
    destroy() {
      this.svg.remove();        // Remove SVG filter
      this.container.remove();  // Remove glass container
      this.canvas.remove();     // Remove hidden canvas
    }
  }

  // Factory function to create and configure the liquid glass effect
  function createLiquidGlass() {
    // Create shader instance with custom fragment function
    const shader = new Shader({
      width: 300,   // Glass width in pixels
      height: 200,  // Glass height in pixels
      
      // Fragment shader function - defines the distortion pattern
      // This creates a lens-like effect that's stronger in the center
      fragment: (uv, mouse) => {
        // Convert UV coordinates to centered coordinates (-0.5 to 0.5)
        const ix = uv.x - 0.5;
        const iy = uv.y - 0.5;
        
        // Calculate distance to the edge of a rounded rectangle
        // This creates the "lens" shape of the distortion
        const distanceToEdge = roundedRectSDF(
          ix, iy,    // Current position
          0.3,       // Half-width of lens area
          0.2,       // Half-height of lens area
          0.6        // Corner radius
        );
        
        // Create smooth falloff from center to edge
        const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
        const scaled = smoothStep(0, 1, displacement);
        
        // Return displaced texture coordinates (creates the magnification effect)
        return texture(ix * scaled + 0.5, iy * scaled + 0.5);
      }
    });

    // Add the glass effect to the page
    shader.appendTo(document.body);

    console.log('Liquid Glass effect created! Drag the glass around the page.');
    
    // Store reference globally so it can be removed if needed
    window.liquidGlass = shader;
  }

  // Initialize the liquid glass effect
  createLiquidGlass();
})();