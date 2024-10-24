// validators.js

export const validateEmail = (email) => {
    // Check if email exists
    if (email === '') {
        return "Email is required";
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email";
    }

    // If all checks pass
    return "";
};

export const validatePassword = (password) => {
    // Check if password exists
    if (password === '') {
        return "Password is required";
    }

    // Check password format (letters and numbers only, min 6 chars)
    const passwordRegex = /^[0-9a-zA-Z]{6,}$/;
    if (!passwordRegex.test(password)) {
        return "Password must contain only letters and numbers and be at least 6 characters";
    }

    // If all checks pass
    return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
    // Check if confirm password exists
    if (confirmPassword === '') {
        return "Please confirm your password";
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return "Passwords do not match";
    }

    // If all checks pass
    return "";
};

// For Login form
export const validateLoginForm = (input) => {
    const errors = {
        email: validateEmail(input.email),
        password: validatePassword(input.password)
    };
    
    const isValid = errors.email === '' && errors.password === '';
    
    return {
        errors,
        isValid
    };
};

// For Register form
export const validateRegisterForm = (input) => {
    const errors = {
        email: validateEmail(input.email),
        password: validatePassword(input.password),
        confirmPassword: validateConfirmPassword(input.password, input.confirmPassword)
    };
    
    const isValid = errors.email === '' && 
                    errors.password === '' && 
                    errors.confirmPassword === '';
    
    return {
        errors,
        isValid
    };
};