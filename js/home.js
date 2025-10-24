

function updateCurrentUser(userData) {
    
    const currentUser = getUser();
    if (currentUser && currentUser.email === userData.email) {
        localStorage.setItem('gigsterUser', JSON.stringify(userData));
        
        const allUsers = getAllUsers();
        const userIndex = allUsers.findIndex(u => u.email === userData.email);
        if (userIndex !== -1) {
            allUsers[userIndex] = userData;
            saveAllUsers(allUsers);
        }
    } else {
        localStorage.setItem('gigsterUser', JSON.stringify(userData));
    }
}

function getUser() {
    const user = localStorage.getItem('gigsterUser');
    return user ? JSON.parse(user) : null;
}

function getAllUsers() {
    const users = localStorage.getItem('gigster_users');
    return users ? JSON.parse(users) : [];
}

function saveAllUsers(users) {
    localStorage.setItem('gigster_users', JSON.stringify(users));
}

function handleGetStarted() {
    window.location.href = 'index.html';
}

function initSharedElements() {
    const user = getUser();
    const navProfileImg = document.getElementById('navProfileImg');
    const profileCircle = document.getElementById('profileCircle');
    const navLinks = document.querySelectorAll('.navbar .nav-link');

    if (!user) {
        const currentPage = window.location.pathname.split('/').pop();
        const publicPages = new Set([
            'index.html', 
            '',         
            'community.html',
            'about.html',
            'help.html',
            'explore-gigs.html',
            'feedback.html'
        ]);

        if (!publicPages.has(currentPage)) {
            window.location.href = 'index.html';
            return;
        }
    }
    
    if (navProfileImg && user) {
        navProfileImg.src = user.profilePic || navProfileImg.src;
    }

    if (profileCircle) {
        profileCircle.addEventListener('click', () => {
            window.location.href = 'account.html';
        });
    }

    if (navLinks && navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || href === '#') return;
                
                window.location.href = href;
            });
        });
    }
}

function initHomePage() {
    const user = getUser();
    const welcomeText = document.getElementById('welcomeText');
    if (!user) return; 

    if (welcomeText) {
        welcomeText.textContent = `Welcome back, ${user.firstName || 'Gigster'}!`;
    }
}

function initAccountPage() {
    const user = getUser();
    const profilePicInput = document.getElementById('profileUpload');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    
    if (!user) return; 

    document.getElementById('profilePic').src = user.profilePic || '../img/logo.png';
    document.getElementById('navProfileImg').src = user.profilePic || '../img/logo.png'; 

    profilePicInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('profilePic').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    saveProfileBtn.addEventListener('click', () => {
        const newProfilePicDataUrl = document.getElementById('profilePic').src;
        
        user.profilePic = newProfilePicDataUrl;

        updateCurrentUser(user);

        alert('Profile picture updated successfully!');
        window.location.reload(); 
    });
}


function handlePostGig(event) {
    event.preventDefault();
    
    const title = document.getElementById('gig-title').value.trim();
    const description = document.getElementById('gig-description').value.trim();
    const category = document.getElementById('gig-category').value;
    const price = parseFloat(document.getElementById('gig-price').value);
    const peopleNeeded = parseInt(document.getElementById('gig-people').value);
    const imagePreview = document.getElementById('imagePreview');

    if (!title || !description || !category || isNaN(price) || isNaN(peopleNeeded)) {
        alert('Please fill out all fields correctly.');
        return;
    }

    if (price <= 0) {
        alert('Price must be greater than 0.');
        return;
    }

    if (peopleNeeded <= 0) {
        alert('Number of people needed must be at least 1.');
        return;
    }

    console.log('Image preview display:', imagePreview.style.display);
    console.log('Image preview src:', imagePreview.src);
    
    const newGig = {
        title,
        description,
        category,
        price,
        peopleNeeded,
        image: (imagePreview.style.display === 'block' && imagePreview.src && imagePreview.src !== '') ? imagePreview.src : '../img/logo.png', 
        createdAt: new Date().toISOString()
    };
    
    console.log('Saving gig with image:', newGig.image);

    const postedGigs = JSON.parse(localStorage.getItem('gigster_posted_gigs')) || [];
    postedGigs.push(newGig);
    localStorage.setItem('gigster_posted_gigs', JSON.stringify(postedGigs));

    const user = getUser(); 
    if (user) {
        user.gigsPosted = (user.gigsPosted || 0) + 1; 
        updateCurrentUser(user);
    }

    document.getElementById('postGigForm').reset();
    imagePreview.style.display = 'none';
    imagePreview.src = '';
    document.querySelector('.image-upload-area').style.display = 'block';

    alert('Gig posted successfully! Your dashboard has been updated.');
    window.location.href = 'account.html'; 
}


function handleApply(event) {
    event.preventDefault();
   
    window.location.href='approval.html';
}

function handleLogout() {
    localStorage.removeItem('gigsterUser');
    localStorage.removeItem('gigster_posted_gigs');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    initSharedElements();

    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'home.html') {
        initHomePage();
    } else if (currentPage === 'account.html') {
        initAccountPage();
    }
});