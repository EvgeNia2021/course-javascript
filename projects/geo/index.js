new Promise(resolve => ymaps.ready(resolve))
  .then(() => init())
  .catch(e => console.log(`Ошибка: ${e.message}`));



const myBalloon = document.querySelector("#balloon");

const addBtn = document.querySelector("#add__btn");
const closeBtn = document.querySelector("#close__btn");

const inputName = document.querySelector("#input__name");
const inputPlace = document.querySelector("#input__place");
const inputText = document.querySelector("#input__txt");
const comments = document.querySelector("#balloon__comments");

const placemarks = [];
let reviews = [];



function init() {
  let myPlacemark;
  let coordinates;
  const myMap = new ymaps.Map(
    "map",
    {
      center: [52.615978, 39.565403],
      zoom: 14
    },
    {
      searchControlProvider: "yandex#search"
    }
  );


  const clusterer = new ymaps.Clusterer({
    preset: "islands#oliveIcon",
    groupByCoordinates: true,
    clusterDisableClickZoom: true,
    clusterHideIconOnBalloonOpen: false,
    clusterOpenBalloonOnClick: true,
    clusterBalloonContentLayout: "cluster#balloonCarousel"

  });

  clusterer.add(placemarks);
  myMap.geoObjects.add(clusterer);
  //clusterer.events.add('click', () => {
  //openBalloon();};
  reviews = getFromLocalStorage();




  myMap.events.add("click", e => {
    const coords = e.get("coords");
    coordinates = coords;
    comments.innerHTML = "Отзывов пока нет";


    openBalloon();
    myPlacemark = createPlacemark(coords);
    reverseGeo(coords);
  });

  function createPlacemark(coords) {
    return new ymaps.Placemark(coords);
  }


  function reverseGeo(coords) {
    ymaps.geocode(coords).then(function (res) {
      const firstGeoObject = res.geoObjects.get(0);

      myPlacemark.properties.set({
        iconCaption: [
          firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),

          firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
        ].filter(Boolean).join(', '),
        balloonContent: firstGeoObject.getAddressLine()
      });


    });
  }

  addBtn.addEventListener("click", () => {
    if (inputName.value && inputPlace.value && inputText.value) {

      myBalloon.style.display = "none";
      saveToLocalStorage(reviews);

      const newPlacemark = new ymaps.Placemark(
        coordinates,
        {
          balloonContentHeader: inputPlace.value,
          balloonContentBody: `<br><br>${inputName.value}<br><br></br><br><br>${inputText.value}<br><br>`,


        },
        {
          preset: "islands#oliveIcon",
          draggable: false,
          openBalloonOnClick: false
        }
      );


      myMap.geoObjects.add(newPlacemark);
      clusterer.add(newPlacemark);
      placemarks.push(newPlacemark);


      if (comments.innerHTML === "Отзывов пока нет")
        comments.innerHTML = "";

      newPlacemark.commentContent = `<div><span><b>${inputName.value}</b></span>
        <span>[${inputPlace.value}]</span>
        <span>${inputText.value}</span></div><br>`;
      comments.innerHTML += newPlacemark.commentContent;


      clearInputs();


      newPlacemark.events.add("click", () => {
        openBalloon();
        comments.innerHTML = newPlacemark.commentContent;

      });
    } else {
      alert("Не все поля заполнены");
    }
  });
}

function getFromLocalStorage() {
  let arr = JSON.parse(localStorage.getItem('reviews'));

  if (!arr) {
    return [];
  }

  return arr;
};

function saveToLocalStorage(arr) {
  localStorage.setItem('reviews', JSON.stringify(arr));
};


closeBtn.addEventListener("click", () => {
  myBalloon.style.display = "none";
  clearInputs();
});

const clearInputs = () => {
  inputName.value = "";
  inputPlace.value = "";
  inputText.value = "";
};



const openBalloon = () => {
  myBalloon.style.top = event.clientY + "px";
  myBalloon.style.left = event.clientX + "px";
  myBalloon.style.display = "block";
};