document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('f');
    const submitBtn = document.getElementById('fSubmit');
    const errorDiv = document.getElementById('fErr');
    const formWrapper = document.getElementById('wlForm');
    const doneWrapper = document.getElementById('wlDone');
    const previewNotice = document.getElementById('wlPreview');
  
    if (previewNotice) {
      previewNotice.style.display = 'none';
    }
  
    if (!form) return;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      errorDiv.textContent = '';
  
      
      const hpField = form.querySelector('input[name="website"]');
      if (hpField && hpField.value.trim() !== '') {
       
        formWrapper.hidden = true;
        doneWrapper.hidden = false;
        return;
      }
  
      const name = form.querySelector('#fName').value.trim();
      const email = form.querySelector('#fEmail').value.trim();
      const consent = form.querySelector('#fOk').checked;
  
      if (!name || !email) {
        errorDiv.textContent = 'Please fill in all required fields.';
        return;
      }
  
      if (!consent) {
        errorDiv.textContent = 'Please consent to platform communications.';
        return;
      }
  
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
  
      const formData = new FormData(form);
  
      try {
        const response = await fetch('https://formspree.io/f/xyeebdww', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (response.ok) {
          formWrapper.hidden = true;
          doneWrapper.hidden = false;
          form.reset();
        } else {
          const data = await response.json();
          if (data && data.errors && data.errors.length > 0) {
            errorDiv.textContent = data.errors.map(err => err.message).join(', ');
          } else {
            errorDiv.textContent = 'Submission failed. Please try again later.';
          }
        }
      } catch (err) {
        errorDiv.textContent = 'Network error. Please check your connection.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  });