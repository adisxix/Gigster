function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.getElementById(pageId).classList.add('active');
}

function goToLanding() {
    showPage('landing-page');
}

function goToLogin() {
    showPage('login-page');
}

function goToSignup(event) {
    if (event) event.preventDefault();
    showPage('signup-page');
}

function goToSuccess() {
    showPage('success-page');
}


function registerNewUser(userData) {
    const users = JSON.parse(localStorage.getItem('gigster_users')) || [];
    users.push(userData);
    localStorage.setItem('gigster_users', JSON.stringify(users));
}

function getUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem('gigster_users')) || [];
    return users.find(user => user.email === email);
}

function saveLoggedInUser(userData) {
    localStorage.setItem('gigsterUser', JSON.stringify(userData));
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    const user = getUserByEmail(email);

    if (user && user.password === password) {
        saveLoggedInUser(user); 
        window.location.href = 'home.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

function handleSignup(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    if (!firstName || !lastName || !phoneNumber) {
        alert('All fields are required.');
        return;
    }

    if (getUserByEmail(email)) {
        alert('Email already registered. Please use a different email.');
        return;
    }

    const newUser = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        profilePic: '../img/logo.png', 
        gigsPosted: 0,
        gigsCompleted: 0,
        earnings: 0,
        createdAt: new Date().toISOString()
    };

    registerNewUser(newUser);

    localStorage.removeItem('gigster_posted_gigs');

    document.getElementById('signup-form').reset();

    goToSuccess();

    setTimeout(() => {
        goToLogin();
    }, 6000);
}

document.addEventListener('DOMContentLoaded', function() {
    showPage('landing-page');

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});