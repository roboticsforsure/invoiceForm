// Invoice Form JavaScript
class InvoiceForm {
    constructor() {
        this.form = document.getElementById('invoiceForm');
        this.fileInput = document.getElementById('pdfInvoice');
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.uploadContent = document.getElementById('uploadContent');
        this.fileSelected = document.getElementById('fileSelected');
        this.fileName = document.getElementById('fileName');
        this.submitBtn = document.getElementById('submitBtn');
        
        this.selectedFile = null;
        this.isSubmitting = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupValidation();
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // File input change
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        
        // Drag and drop events
        this.fileUploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileUploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.fileUploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.fileUploadArea.addEventListener('drop', this.handleDrop.bind(this));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('.form-field');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        // Checkbox validation
        const checkbox = document.getElementById('privacyConsent');
        checkbox.addEventListener('change', () => this.validateField(checkbox));
    }
    
    setupValidation() {
        // Email validation pattern
        this.emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validate all fields
        if (!this.validateForm()) {
            this.showError('Please fix the errors above and try again.');
            return;
        }
        
        this.submitForm();
    }
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }
    
    handleDragOver(e) {
        e.preventDefault();
        this.fileUploadArea.classList.add('drag-over');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        this.fileUploadArea.classList.remove('drag-over');
    }
    
    handleDrop(e) {
        e.preventDefault();
        this.fileUploadArea.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            this.processFile(file);
        }
    }
    
    processFile(file) {
        // Validate file type
        if (file.type !== 'application/pdf') {
            this.showFieldError('pdfInvoice', 'Please select a PDF file.');
            return;
        }
        
        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            this.showFieldError('pdfInvoice', 'File size must be less than 10MB.');
            return;
        }
        
        this.selectedFile = file;
        this.showFileSelected(file);
        this.clearFieldError('pdfInvoice');
    }
    
    showFileSelected(file) {
        this.uploadContent.style.display = 'none';
        this.fileSelected.style.display = 'flex';
        this.fileName.textContent = file.name;
        this.fileUploadArea.classList.add('file-selected');
    }
    
    validateForm() {
        let isValid = true;
        
        // Validate required text fields
        const requiredFields = ['name', 'companyName', 'companyEmail'];
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate select fields
        const selectFields = ['companySize', 'industry', 'country'];
        selectFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate file upload
        if (!this.selectedFile) {
            this.showFieldError('pdfInvoice', 'Please upload a PDF invoice.');
            isValid = false;
        }
        
        // Validate privacy consent
        const privacyConsent = document.getElementById('privacyConsent');
        if (!this.validateField(privacyConsent)) {
            isValid = false;
        }
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        
        // Clear previous errors
        this.clearFieldError(fieldName);
        field.classList.remove('error', 'success');
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(fieldName, 'This field is required.');
            field.classList.add('error');
            return false;
        }
        
        // Specific field validations
        switch (fieldName) {
            case 'companyEmail':
                if (value && !this.emailPattern.test(value)) {
                    this.showFieldError(fieldName, 'Please enter a valid email address.');
                    field.classList.add('error');
                    isValid = false;
                } else if (value) {
                    field.classList.add('success');
                }
                break;
                
            case 'privacyConsent':
                if (!field.checked) {
                    this.showFieldError(fieldName, 'You must accept the privacy policy to continue.');
                    isValid = false;
                }
                break;
                
            default:
                if (value) {
                    field.classList.add('success');
                }
                break;
        }
        
        return isValid;
    }
    
    showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    clearFieldError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    async submitForm() {
        this.isSubmitting = true;
        this.setLoadingState(true);
        
        try {
            // Create FormData
            const formData = new FormData();
            
            // Add form fields
            const formElements = this.form.elements;
            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                
                if (element.type === 'checkbox') {
                    // Skip privacy consent as it's not sent to server
                    continue;
                } else if (element.type === 'file') {
                    if (this.selectedFile) {
                        formData.append('pdfInvoice', this.selectedFile);
                    }
                } else if (element.name && element.value) {
                    formData.append(element.name, element.value);
                }
            }
            
            // Simulate API call (replace with your actual endpoint)
            const response = await this.submitToAPI(formData);
            
            if (response.success) {
                this.showSuccess();
                this.resetForm();
            } else {
                throw new Error(response.message || 'Submission failed');
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showError(error.message || 'Failed to submit invoice. Please try again.');
        } finally {
            this.isSubmitting = false;
            this.setLoadingState(false);
        }
    }
    
    async submitToAPI(formData) {
        // Simulate API call - replace with your actual API endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate successful response
                resolve({
                    success: true,
                    message: 'Invoice submitted successfully!'
                });
            }, 2000);
        });
        
        // Uncomment and modify for real API integration:
        /*
        try {
            const response = await fetch('/api/invoice-submissions', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Submission failed');
            }
            
            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
        */
    }
    
    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('loading');
            this.submitBtn.innerHTML = `
                <svg class="btn-icon animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Processing...
            `;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
            this.submitBtn.innerHTML = `
                <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                </svg>
                Extract Invoice Data
            `;
        }
    }
    
    showSuccess() {
        const modal = document.getElementById('successModal');
        modal.classList.add('show');
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            this.closeModal();
        }, 3000);
    }
    
    showError(message) {
        const modal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        modal.classList.add('show');
    }
    
    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    }
    
    resetForm() {
        this.form.reset();
        this.selectedFile = null;
        
        // Reset file upload area
        this.uploadContent.style.display = 'flex';
        this.fileSelected.style.display = 'none';
        this.fileUploadArea.classList.remove('file-selected');
        
        // Clear all errors and states
        const fields = this.form.querySelectorAll('.form-field');
        fields.forEach(field => {
            field.classList.remove('error', 'success');
        });
        
        const errors = this.form.querySelectorAll('.error-message');
        errors.forEach(error => {
            error.classList.remove('show');
        });
    }
}

// Utility functions
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
}

// Add spinning animation for loading state
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InvoiceForm();
});

// Handle modal close on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InvoiceForm, closeModal };
}