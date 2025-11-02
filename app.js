// frontend/app.js (inside the index.html block)
fetch(`${API_BASE}/calendar`)
  .then(r => r.json())
  .then(data => {
    const sl = document.getElementById('slots-list');
    sl.innerHTML = ''; // clear any previous
    data.available_slots.slice(0, 5).forEach(slotIso => {
      const li = document.createElement('li');

      // Create an anchor that books + redirects
      const link = document.createElement('a');
      link.className = 'btn primary';
      link.textContent = new Date(slotIso).toLocaleString();
      
      // URL-encode the slot and any participants you want to pass
      const participants = ['alice','bob']; 
      const params = new URLSearchParams({
        slot: slotIso,
        participants: JSON.stringify(participants)
      });
      link.href = `meeting.html?${params}`;

      li.append(link);
      sl.append(li);
    });
  });
