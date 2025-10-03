// Product Review Form JavaScript

// Product array as specified in the assignment
const products = [
    {
      id: "fc-1888",
      name: "flux capacitor",
      averagerating: 4.5
    },
    {
      id: "fc-2050",
      name: "power laces",
      averagerating: 4.7
    },
    {
      id: "fs-1987",
      name: "time circuits",
      averagerating: 3.5
    },
    {
      id: "ac-2000",
      name: "low voltage reactor",
      averagerating: 3.9
    },
    {
      id: "jj-1969",
      name: "warp equalizer",
      averagerating: 5.0
    }
];

// DOM elements
let productSelect;
let starInputs;
let form;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    productSelect = document.getElementById('product');
    starInputs = document.querySelectorAll('input[name="rating"]');
    form = document.getElementById('review-form');
    
    populateProducts();
    setupStarRating();
    setupFormHandling();
    setLastModified();
    
    console.log('Product Review Form initialized');
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
 * Populate the product select dropdown with options from the products array
 */
function populateProducts() {
    if (!productSelect) return;
    
    // Clear existing options except the placeholder
    const placeholder = productSelect.querySelector('option[value=""]');
    productSelect.innerHTML = '';
    
    // Add placeholder back
    if (placeholder) {
        productSelect.appendChild(placeholder);
    } else {
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Choose a Product...';
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        productSelect.appendChild(placeholderOption);
    }
    
    // Add product options
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (★ ${product.averagerating})`;
        productSelect.appendChild(option);
    });
    
    console.log('Product options populated');
}

/**
 * Setup star rating functionality
 */
function setupStarRating() {
    if (!starInputs.length) return;
    
    const radioCircles = document.querySelectorAll('.radio-circle');
    const ratingText = document.querySelector('.rating-text');
    
    // Rating descriptions
    const ratingDescriptions = {
        '1': 'Poor - Significantly below expectations',
        '2': 'Fair - Below expectations',
        '3': 'Good - Meets expectations',
        '4': 'Very Good - Exceeds expectations',
        '5': 'Excellent - Far exceeds expectations'
    };
    
    // Add event listeners to radio circles
    radioCircles.forEach((circle, index) => {
        const starValue = index + 1;
        
        // Click handler
        circle.addEventListener('click', function() {
            const radioInput = document.querySelector(`input[name="rating"][value="${starValue}"]`);
            if (radioInput) {
                radioInput.checked = true;
                updateRatingText(starValue, ratingDescriptions);
            }
        });
    });
    
    // Radio button change handler (for keyboard accessibility)
    starInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                updateRatingText(parseInt(this.value), ratingDescriptions);
            }
        });
    });
    
    /**
     * Update rating text description
     */
    function updateRatingText(rating, descriptions) {
        if (ratingText) {
            const description = descriptions[rating.toString()] || '';
            ratingText.innerHTML = `
                <span class="rating-value">${rating} out of 5 stars</span>
                ${description ? `<br><span class="rating-description">${description}</span>` : ''}
            `;
        }
    }
    
    console.log('Star rating functionality setup complete');
}

/**
 * Setup form handling and validation
 */
function setupFormHandling() {
    if (!form) return;
    
    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Real-time validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    console.log('Form handling setup complete');
}

/**
 * Validate individual field
 */
function validateField(field) {
    const formGroup = field.closest('.form-group') || field.closest('fieldset');
    const errorMessage = formGroup ? formGroup.querySelector('.error-message') : null;
    
    // Remove existing error state
    if (formGroup) {
        formGroup.classList.remove('error');
    }
    if (errorMessage) {
        errorMessage.remove();
    }
    
    let isValid = true;
    let message = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required')) {
        if (field.type === 'radio') {
            const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                isValid = false;
                message = 'Please select a rating';
            }
        } else if (!field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        }
    }
    
    // Additional validation for specific fields
    if (field.type === 'date' && field.value) {
        const selectedDate = new Date(field.value);
        const today = new Date();
        if (selectedDate > today) {
            isValid = false;
            message = 'Installation date cannot be in the future';
        }
    }
    
    // Show error if invalid
    if (!isValid && formGroup) {
        formGroup.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    return isValid;
}

/**
 * Validate entire form
 */
function validateForm() {
    let isValid = true;
    
    // Validate product selection
    const productField = document.getElementById('product');
    if (!validateField(productField)) {
        isValid = false;
    }
    
    // Validate rating
    const ratingChecked = form.querySelector('input[name="rating"]:checked');
    if (!ratingChecked) {
        const ratingFieldset = form.querySelector('fieldset');
        if (ratingFieldset) {
            ratingFieldset.classList.add('error');
            const existingError = ratingFieldset.querySelector('.error-message');
            if (!existingError) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = 'Please select a rating';
                ratingFieldset.appendChild(errorDiv);
            }
        }
        isValid = false;
    }
    
    // Validate other required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (field.name !== 'rating' && !validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Submit form and redirect to review page
 */
function submitForm() {
    try {
        // Collect form data
        const formData = new FormData(form);
        const reviewData = {};
        
        // Process form data
        for (let [key, value] of formData.entries()) {
            if (key === 'features') {
                // Handle multiple checkbox values
                if (!reviewData[key]) {
                    reviewData[key] = [];
                }
                reviewData[key].push(value);
            } else {
                reviewData[key] = value;
            }
        }
        
        // Get product name from ID
        const selectedProduct = products.find(p => p.id === reviewData.product);
        if (selectedProduct) {
            reviewData.productName = selectedProduct.name;
        }
        
        // Add timestamp
        reviewData.timestamp = new Date().toISOString();
        
        // Store in localStorage for the review page
        localStorage.setItem('currentReview', JSON.stringify(reviewData));
        
        // Update review counter
        updateReviewCounter();
        
        // Redirect to review page
        window.location.href = 'review.html';
        
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your review. Please try again.');
    }
}

/**
 * Update the review counter in localStorage
 */
function updateReviewCounter() {
    try {
        let count = parseInt(localStorage.getItem('reviewCount') || '0');
        count++;
        localStorage.setItem('reviewCount', count.toString());
        console.log('Review counter updated:', count);
    } catch (error) {
        console.error('Error updating review counter:', error);
    }
}

/**
 * Utility function to format date for display
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
        return dateString;
    }
}

/**
 * Get current review counter
 */
function getReviewCount() {
    try {
        return parseInt(localStorage.getItem('reviewCount') || '0');
    } catch (error) {
        return 0;
    }
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        populateProducts,
        updateReviewCounter,
        getReviewCount,
        formatDate
    };
}