// Product Review Confirmation Page JavaScript

// DOM elements
let reviewDetails;
let reviewCount;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    reviewDetails = document.getElementById('review-details');
    reviewCount = document.getElementById('review-count');
    
    displayReviewSummary();
    displayReviewCounter();
    setLastModified();
    
    console.log('Review confirmation page initialized');
});

/**
 * Set the last modified date in the footer
 */
function setLastModified() {
    const lastModifiedElement = document.getElementById('last-modified-date');
    if (lastModifiedElement) {
        // Set to current date: October 3, 2025
        const now = new Date('2025-10-03T13:56:10');
        const formattedDate = now.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        }) + ' ' + now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        lastModifiedElement.textContent = formattedDate;
    }
}

/**
 * Display the review summary from localStorage
 */
function displayReviewSummary() {
    try {
        const reviewData = localStorage.getItem('currentReview');
        
        if (!reviewData) {
            console.warn('No review data found');
            showNoReviewMessage();
            return;
        }
        
        const review = JSON.parse(reviewData);
        
        if (!reviewDetails) {
            console.error('Review details container not found');
            return;
        }
        
        // Create review summary HTML
        const summaryHTML = createReviewSummaryHTML(review);
        reviewDetails.innerHTML = summaryHTML;
        
        console.log('Review summary displayed:', review);
        
    } catch (error) {
        console.error('Error displaying review summary:', error);
        showErrorMessage();
    }
}

/**
 * Create HTML for review summary
 */
function createReviewSummaryHTML(review) {
    const features = Array.isArray(review.features) ? review.features : [];
    const featuresText = features.length > 0 ? features.join(', ') : 'None selected';
    
    return `
        <div class="detail-item">
            <span class="detail-label">Product:</span>
            <span class="detail-value">${escapeHtml(review.productName || 'Unknown Product')}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Rating:</span>
            <span class="detail-value">${generateStarDisplay(review.rating)} (${review.rating}/5)</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Installation Date:</span>
            <span class="detail-value">${formatDate(review.installDate)}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Useful Features:</span>
            <span class="detail-value">${escapeHtml(featuresText)}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Written Review:</span>
            <span class="detail-value">${escapeHtml(review.writtenReview || 'No written review provided')}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Reviewer Name:</span>
            <span class="detail-value">${escapeHtml(review.userName || 'Anonymous')}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Submitted:</span>
            <span class="detail-value">${formatDateTime(review.timestamp)}</span>
        </div>
    `;
}

/**
 * Generate star display for rating
 */
function generateStarDisplay(rating) {
    const numRating = parseInt(rating) || 0;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= numRating) {
            stars += '★';
        } else {
            stars += '☆';
        }
    }
    
    return stars;
}

/**
 * Display the review counter
 */
function displayReviewCounter() {
    try {
        const count = getReviewCount();
        
        if (reviewCount) {
            reviewCount.textContent = count;
        }
        
        console.log('Review counter displayed:', count);
        
    } catch (error) {
        console.error('Error displaying review counter:', error);
        if (reviewCount) {
            reviewCount.textContent = '0';
        }
    }
}

/**
 * Get review count from localStorage
 */
function getReviewCount() {
    try {
        return parseInt(localStorage.getItem('reviewCount') || '0');
    } catch (error) {
        console.error('Error getting review count:', error);
        return 0;
    }
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * Format date and time for display
 */
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'Unknown';
    
    try {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting datetime:', error);
        return dateTimeString;
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return String(text);
    }
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show message when no review data is found
 */
function showNoReviewMessage() {
    if (reviewDetails) {
        reviewDetails.innerHTML = `
            <div class="no-review-message">
                <p>No review data found. Please submit a review first.</p>
                <a href="form.html" class="btn btn-primary">Submit a Review</a>
            </div>
        `;
    }
}

/**
 * Show error message
 */
function showErrorMessage() {
    if (reviewDetails) {
        reviewDetails.innerHTML = `
            <div class="error-message">
                <p>There was an error loading your review data.</p>
                <a href="form.html" class="btn btn-primary">Try Again</a>
            </div>
        `;
    }
}

/**
 * Clear current review data (useful for testing)
 */
function clearCurrentReview() {
    try {
        localStorage.removeItem('currentReview');
        console.log('Current review data cleared');
    } catch (error) {
        console.error('Error clearing review data:', error);
    }
}

/**
 * Reset review counter (useful for testing)
 */
function resetReviewCounter() {
    try {
        localStorage.removeItem('reviewCount');
        console.log('Review counter reset');
        displayReviewCounter();
    } catch (error) {
        console.error('Error resetting review counter:', error);
    }
}

/**
 * Get all review data for debugging
 */
function getDebugInfo() {
    try {
        return {
            currentReview: JSON.parse(localStorage.getItem('currentReview') || 'null'),
            reviewCount: localStorage.getItem('reviewCount'),
            localStorage: { ...localStorage }
        };
    } catch (error) {
        console.error('Error getting debug info:', error);
        return null;
    }
}

// Export functions for testing and debugging
if (typeof window !== 'undefined') {
    window.reviewPageDebug = {
        clearCurrentReview,
        resetReviewCounter,
        getDebugInfo,
        getReviewCount,
        formatDate,
        formatDateTime
    };
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        formatDateTime,
        generateStarDisplay,
        escapeHtml,
        getReviewCount
    };
}