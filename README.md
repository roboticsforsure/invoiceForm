# Invoice Extractor Form

A beautiful, responsive invoice submission form with a blue-to-purple gradient background. This form allows users to upload PDF invoices and submit company information.

## Features

- 🎨 **Beautiful Gradient Design**: Blue-to-purple gradient background inspired by modern web design
- 📱 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 📄 **PDF Upload**: Drag & drop or click to upload PDF invoices (10MB limit)
- ✅ **Form Validation**: Real-time validation with user-friendly error messages
- 🚀 **Smooth Animations**: Subtle hover effects and transitions
- ♿ **Accessible**: Built with accessibility best practices
- 🔒 **Secure**: Client-side validation and file type checking

## Files Included

- `invoice-form.html` - Main HTML structure
- `invoice-form.css` - Complete CSS styling with gradient background
- `invoice-form.js` - JavaScript functionality and validation
- `README.md` - This documentation file

## Quick Start

1. Download all files to a folder
2. Open `invoice-form.html` in your web browser
3. The form is ready to use!

## Form Fields

### Basic Information
- **Name** - Full name (required)
- **Company Name** - Company name (required)
- **Company Size** - Dropdown with options: 0-10, 11-50, 51-200, >200 (required)
- **Company Email** - Valid email address (required)
- **Industry** - Industry selection from predefined list (required)
- **Country** - Country selection: Australia, Saudi Arabia, UAE, Other (required)

### File Upload
- **PDF Invoice** - Drag & drop or click to upload PDF files only (required)
- Maximum file size: 10MB
- Only PDF files are accepted

### Privacy Consent
- Checkbox for privacy policy agreement (required)

## Customization

### Colors
The color scheme uses CSS custom properties (variables) defined in `:root`:

```css
:root {
    --primary-blue: hsl(213, 71%, 58%);
    --primary-purple: hsl(280, 50%, 58%);
    --accent-purple: hsl(288, 44%, 49%);
    --text-dark: hsl(210, 22%, 22%);
    --success-green: hsl(145, 63%, 42%);
    --error-red: hsl(0, 84%, 60%);
}
```

### Gradient Background
The gradient can be modified in the `.container` CSS class:

```css
background: linear-gradient(135deg, var(--primary-blue) 0%, hsl(252, 56%, 67%) 50%, var(--primary-purple) 100%);
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## API Integration

The JavaScript includes a placeholder for API integration. Replace the `submitToAPI` method in `invoice-form.js` with your actual API endpoint:

```javascript
async submitToAPI(formData) {
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
}
```

## Form Validation

The form includes comprehensive validation:

- **Required fields**: All marked fields must be filled
- **Email validation**: Proper email format checking
- **File validation**: PDF files only, 10MB maximum
- **Real-time feedback**: Errors shown immediately, success states displayed
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Mobile Responsiveness

The form automatically adapts to different screen sizes:

- **Desktop**: Two-column layout for form fields
- **Tablet**: Single column with optimized spacing
- **Mobile**: Compact layout with touch-friendly buttons

## Security Features

- Client-side file type validation
- File size limits
- XSS protection through proper input handling
- No external dependencies (uses only vanilla JavaScript)

## License

This form template is free to use and modify for any purpose.

## Support

For questions or issues, please refer to the code comments or modify as needed for your specific requirements.