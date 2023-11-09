//timer
class Timer {
    constructor(root) {
      root.innerHTML = Timer.getHTML();
  
      this.el = {
        minutes: root.querySelector(".timer__part--minutes"),
        seconds: root.querySelector(".timer__part--seconds"),
        control: root.querySelector(".timer__btn--control"),
        reset: root.querySelector(".timer__btn--reset")
      };
  
      this.interval = null;
      this.remainingSeconds = 0;
  
      this.el.control.addEventListener("click", () => {
        if (this.interval === null) {
          this.start();
        } else {
          this.stop();
        }
      });
  
      this.el.reset.addEventListener("click", () => {
        const inputMinutes = prompt("Enter number of minutes:");
  
        if (inputMinutes < 60) {
          this.stop();
          this.remainingSeconds = inputMinutes * 60;
          this.updateInterfaceTime();
        }
      });
    }
  
    updateInterfaceTime() {
      const minutes = Math.floor(this.remainingSeconds / 60);
      const seconds = this.remainingSeconds % 60;
  
      this.el.minutes.textContent = minutes.toString().padStart(2, "0");
      this.el.seconds.textContent = seconds.toString().padStart(2, "0");
    }
  
    updateInterfaceControls() {
      if (this.interval === null) {
        this.el.control.innerHTML = `<span class="material-icons">play_arrow</span>`;
        this.el.control.classList.add("timer__btn--start");
        this.el.control.classList.remove("timer__btn--stop");
      } else {
        this.el.control.innerHTML = `<span class="material-icons">pause</span>`;
        this.el.control.classList.add("timer__btn--stop");
        this.el.control.classList.remove("timer__btn--start");
      }
    }
  
    start() {
      if (this.remainingSeconds === 0) return;
  
      this.interval = setInterval(() => {
        this.remainingSeconds--;
        this.updateInterfaceTime();
  
        if (this.remainingSeconds === 0) {
          this.stop();
        }
      }, 1000);
  
      this.updateInterfaceControls();
    }
  
    stop() {
      clearInterval(this.interval);
  
      this.interval = null;
  
      this.updateInterfaceControls();
    }
  
    static getHTML() {
      return `
                <div class="timer-align">
                <h2 class="timer-title" >Set your timer! </h2>
              <span class="timer__part timer__part--minutes">00</span>
              <span class="timer__part">:</span>
              <span class="timer__part timer__part--seconds">00</span>
              <button type="button" class="timer__btn timer__btn--control timer__btn--start">
                  <span class="material-icons">play_arrow</span>
              </button>
              <button type="button" class="timer__btn timer__btn--reset">
                  <span class="material-icons">timer</span>
              </button>
              </div>
          `;
    }
  }
  
  new Timer(
      document.querySelector(".timer")
  );

  //camera 
  // Create a local database to store the photos
var db = new Dexie("PhotoGallery");

/**
 * id: autoincremented number
 * taken: datetime when photo was taken
 * filesize: size of photo in bytes
 * photo: blob of image data
 */
db.version(1).stores({
  photos: `
    ++id,
    name,
    taken,
    filesize,
    photo`
});

// Get a reference to the file:input
let camera = document.querySelector("#camera");

// Listen to camera for a change in selection

camera.addEventListener("change", async (event) => {
  // When file input changes, run this code...
  let file = camera.files[0];

  // If the user has taken a photo, store in our database
  if (file) {
    await db.photos.add({
      name: file.name,
      taken: file.lastModified,
      filesize: file.size,
      photo: file
    });
  }
});

// The element that will hold all of our photos
let photoGallery = document.querySelector("#photos");

/**
 * Update our page whenever changes are detected in the database
 * See: https://dexie.org/docs/liveQuery()#vanilla-js
 */
Dexie.on("storagemutated", printPhotos);

async function printPhotos(changedData = null) {
  photoGallery.innerHTML = "";
  await db.photos.each((item) => {
    // Create the HTML, using the photo from the DB as the src
    let img = document.createElement("img");
    img.src = URL.createObjectURL(item.photo);
    // img.title = p
    photoGallery.appendChild(img);
  });
}

/**
 * Run this function as soon as the page loads in case there
 * are existing photos in the database.
 */
printPhotos();
