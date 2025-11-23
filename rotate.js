const words = ["Love", "Passion", "Innovation", "Growth", "Vision"];
let index = 0;
const rotate = document.getElementById("rotateWord");
if (rotate) {
  setInterval(() => {
    index = (index + 1) % words.length;
    rotate.innerText = words[index];
    rotate.classList.remove("rotating-text");
    void rotate.offsetWidth;
    rotate.classList.add("rotating-text");
  }, 1800);
}
