/**
 * swapLab - Main JavaScript File
 * Handles form submissions, LocalStorage, Dynamic Rendering, and Search
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Scroll to Top Button Logic ---
    const scrollBtn = document.getElementById('scrollTopBtn');
    
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    };

    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 2. Mobile Menu Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- 3. Profile Form Handling (profile.html) ---
    const profileForm = document.getElementById('profileForm');
    
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get values from form
            const fullName = document.getElementById('fullName').value;
            const college = document.getElementById('college').value;
            const skillsTeach = document.getElementById('skillsTeach').value;
            const skillsLearn = document.getElementById('skillsLearn').value;
            const about = document.getElementById('about').value;

            // Create Profile Object
            const profile = {
                id: Date.now(),
                fullName,
                college,
                skillsTeach: skillsTeach.split(',').map(s => s.trim()), // Convert string to array
                skillsLearn: skillsLearn.split(',').map(s => s.trim()),
                about
            };

            // Save to LocalStorage
            saveProfileToLocal(profile);

            // UI Feedback
            const successMsg = document.getElementById('successMessage');
            successMsg.classList.remove('hidden');
            profileForm.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                successMsg.classList.add('hidden');
            }, 5000);
        });
    }

    // --- 4. Browse Page Logic (browse.html) ---
    const profilesGrid = document.getElementById('profilesGrid');
    const searchInput = document.getElementById('searchInput');
    const emptyState = document.getElementById('emptyState');

    if (profilesGrid) {
        let allProfiles = getProfiles();

        // Initial Render
        renderProfiles(allProfiles);

        // Search Functionality
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allProfiles.filter(profile => {
                // Check if term exists in Name, Teach Skills, or Learn Skills
                const teachMatch = profile.skillsTeach.some(s => s.toLowerCase().includes(term));
                const learnMatch = profile.skillsLearn.some(s => s.toLowerCase().includes(term));
                const nameMatch = profile.fullName.toLowerCase().includes(term);
                return teachMatch || learnMatch || nameMatch;
            });
            renderProfiles(filtered);
        });
    }
});

/**
 * LocalStorage Helper Functions
 */
function saveProfileToLocal(profile) {
    let profiles = JSON.parse(localStorage.getItem('swapLab_profiles')) || [];
    profiles.push(profile);
    localStorage.setItem('swapLab_profiles', JSON.stringify(profiles));
}

function getProfiles() {
    return JSON.parse(localStorage.getItem('swapLab_profiles')) || [];
}

/**
 * Render Profiles to the DOM
 */
function renderProfiles(profiles) {
    const profilesGrid = document.getElementById('profilesGrid');
    const emptyState = document.getElementById('emptyState');
    
    profilesGrid.innerHTML = ''; // Clear current content

    if (profiles.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        
        profiles.forEach(profile => {
            // Generate HTML for skill tags
            const teachTags = profile.skillsTeach.map(s => `<span class="tag tag-teach">${s}</span>`).join('');
            const learnTags = profile.skillsLearn.map(s => `<span class="tag tag-learn">${s}</span>`).join('');

            // Create Card Element
            const card = document.createElement('div');
            card.className = 'card profile-card fade-in';
            card.innerHTML = `
                <div class="card-header">
                    <div class="avatar">${profile.fullName.charAt(0)}</div>
                    <div>
                        <h3>${profile.fullName}</h3>
                        <span class="college"><i class="fas fa-university"></i> ${profile.college}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="skills-container">
                        <p class="skill-label">Can Teach:</p>
                        <div class="tags-wrapper">${teachTags}</div>
                    </div>
                    <div class="skills-container">
                        <p class="skill-label">Wants to Learn:</p>
                        <div class="tags-wrapper">${learnTags}</div>
                    </div>
                    <p class="about-text">"${profile.about}"</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary btn-block" onclick="requestSkill('${profile.fullName}')">
                        Request Skill Exchange
                    </button>
                </div>
            `;
            profilesGrid.appendChild(card);
        });
    }
}

/**
 * Global function for Request Button
 * Attached to window so inline onclick works
 */
window.requestSkill = (name) => {
    alert(`🚀 Request sent to ${name}! They will reach out to you soon.`);
};