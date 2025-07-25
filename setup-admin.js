const response = await fetch('http://localhost:3000/api/admin/setup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
console.log('Admin setup result:', result);
