self.addEventListener('message', ({ data }) => {
  console.log(data);
  // postMessage(data.map(i => i * i));
});
