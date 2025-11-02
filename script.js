// Shared DOM helpers
function $(s){return document.querySelector(s);}
function $$(s){return [...document.querySelectorAll(s)];}

// 1. Dashboard page logic
if (location.pathname.endsWith('index.html')) {
  // Upcoming meetings (stub)
  const meetings = ['Team Sync – Tomorrow 10 AM', 'Client Call – Fri 2 PM'];
  const ml = $('#meetings-list');
  meetings.forEach(m => {
    const li = document.createElement('li');
    li.textContent = m;
    ml.append(li);
  });

  // Fetch available slots
  fetch('http://localhost:5000/api/calendar')
    .then(r => r.json())
    .then(data => {
      const sl = $('#slots-list');
      data.available_slots.slice(0,5).forEach(slot => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = new Date(slot).toLocaleString();
        btn.onclick = () => alert(`Booked ${slot}`);
        li.append(btn);
        sl.append(li);
      });
    });
}

// 2. Meeting page logic
if (location.pathname.endsWith('meeting.html')) {
  // Tab switching
  $$('.tabs button').forEach(btn => {
    btn.onclick = () => {
      $$('.tabs button').forEach(b=>b.classList.remove('active'));
      $$('.tab-content').forEach(c=>c.classList.remove('active'));
      btn.classList.add('active');
      $('#' + btn.dataset.tab).classList.add('active');
    };
  });

  // Load agenda
  fetch('http://localhost:5000/api/agenda', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ participants: ['alice','bob'] })
  })
    .then(r=>r.json())
    .then(data=>{
      const al = $('#agenda-list');
      data.agenda.forEach(item=>{
        const li = document.createElement('li');
        li.textContent = '• ' + item;
        al.append(li);
      });
    });

  // Poll for transcript every 5s
  setInterval(()=>{
    fetch('http://localhost:5000/api/transcript',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ audio_url: null })
    })
      .then(r=>r.json())
      .then(({transcript})=>{
        const log = $('#transcript-log');
        const p = document.createElement('p');
        p.textContent = transcript;
        log.append(p);
        log.scrollTop = log.scrollHeight;
      });
  }, 5000);

  // Reminders
  function loadReminders(){
    fetch('http://localhost:5000/api/reminders')
      .then(r=>r.json())
      .then(data=>{
        const rl = $('#reminders-list');
        rl.innerHTML = '';
        data.reminders.forEach(r=>{
          const li = document.createElement('li');
          li.textContent = `• ${r.task} (${r.status})`;
          rl.append(li);
        });
      });
  }
  loadReminders();
  $('#add-reminder').onclick = ()=>{
    const task = $('#new-reminder').value.trim();
    if(!task) return;
    fetch('http://localhost:5000/api/reminders',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ task, status: 'pending' })
    })
      .then(()=>{ $('#new-reminder').value=''; loadReminders(); });
  };

  // Trust score
  fetch('http://localhost:5000/api/trust_score')
    .then(r=>r.json())
    .then(data=>{ $('#trust-value').textContent = data.trust_score; });

  // Voice memos (quick stub)
  let recorder, chunks=[];
  $('#start-record').onclick = async ()=>{
    if(!recorder){
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e=>chunks.push(e.data);
      recorder.onstop = ()=>{
        const blob = new Blob(chunks);
        chunks = [];
        const url = URL.createObjectURL(blob);
        const li = document.createElement('li');
        li.innerHTML = `<audio src="${url}" controls></audio>`;
        $('#voice-memos').append(li);
      };
      recorder.start();
      $('#start-record').textContent = '⏹️ Stop & Save';
    } else {
      recorder.stop();
      recorder = null;
      $('#start-record').textContent = '🎙️ Record Memo';
    }
  };
}
