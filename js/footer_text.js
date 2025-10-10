// Footer text management for IITG Coding Club website
// This script dynamically sets the credit and copyright text in the footer across all pages

// Credit line text
var creditText = "This website is maintained by the IIT Guwahati Online Degree Coding Club members under faculty supervision.";

// Copyright text with Unicode copyright symbol and current year
// \u00a9 = © (Unicode escape sequence for copyright symbol)
// Using Unicode ensures cross-browser compatibility and proper rendering
var copyrightText = "\u00a92025 ODP Coding Club, IITG | All rights reserved";

// Combine both texts with proper styling
var combinedText = '<p style="margin-top: 1rem; font-size: 0.95rem; opacity: 0.8;">' + creditText + '</p>' +
                   '<p style="margin-top: 0.8rem; font-size: 1rem; opacity: 0.7; font-weight: bold;">' + copyrightText + '</p>';

// Find the footer text element and update its content
// This approach allows for centralized footer text management across multiple pages
// The element with ID "footer_text" should exist on all pages that include this script
document.getElementById("footer_text").innerHTML = combinedText;