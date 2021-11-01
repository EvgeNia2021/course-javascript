import './index.html'
import './main.css'

window.addEventListener('DOMContentLoaded', () => {
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
  });

  clusterer.events.add('click', (e) => {
    coordinates = e.get('target').geometry.getCoordinates() //получение координат кластера
  })

  clusterer.add(placemarks);
  myMap.geoObjects.add(clusterer);
  //clusterer.events.add('click', () => {
  //openBalloon();};
  reviews = getFromLocalStorage();

  reviews.forEach((review) => {
    console.log(review)
    clusterer.add(createPlacemark(review.coords, {
      prop: {
        balloonContentHeader: review.place,
        balloonContentBody: `<br><br>${review.name}<br><br></br><br><br>${review.text}<br><br>`
      },
      custom:  {
        preset: "islands#oliveIcon",
        draggable: false,
        openBalloonOnClick: false
      }
    }))
  })




  myMap.events.add("click", e => {
    const coords = e.get("coords");
    coordinates = coords;
    comments.innerHTML = "Отзывов пока нет";


    openBalloon();
    reverseGeo(coords);
  });

  function createPlacemark(coords, settings) {
    const find = reviews.find((review) => JSON.stringify(review.coords) === JSON.stringify(coords))

    console.log(find)
    const placemark = new ymaps.Placemark(coords, settings.prop, settings.custom);
    // placemark.commentContent = `<div><span><b>${inputName.value}</b></span>
    //     <span>[${inputPlace.value}]</span>
    //     <span>${inputText.value}</span></div><br>`;

    placemark.events.add("click", (e) => {
      openBalloon();

      coordinates = e.get('target').geometry.getCoordinates() //получение координат метки
      comments.innerHTML = `<br><br>${find.name}<br><br></br><br><br>${find.text}<br><br>`;

    });

    return placemark
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
    console.log('sdsdsd')
    if (inputName.value && inputPlace.value && inputText.value) {

      let point = {
        name: inputName.value,
        place: inputPlace.value,
        text: inputText.value,
        coords: coordinates
      }

      reviews.push(point)

      myBalloon.style.display = "none";
      saveToLocalStorage(reviews);

      const newPlacemark = createPlacemark(coordinates, {
        
          prop: {
            balloonContentHeader: inputPlace.value,
            balloonContentBody: `<br><br>${inputName.value}<br><br></br><br><br>${inputText.value}<br><br>` 
          },
          custom: {
            preset: "islands#oliveIcon",
            draggable: false,
            openBalloonOnClick: false
          }
        
      })


      myMap.geoObjects.add(newPlacemark);
      clusterer.add(newPlacemark);
      placemarks.push(newPlacemark);


      // if (comments.innerHTML === "Отзывов пока нет")
      //   comments.innerHTML = "";

      // // newPlacemark.commentContent = `<div><span><b>${inputName.value}</b></span>
      // //   <span>[${inputPlace.value}]</span>
      // //   <span>${inputText.value}</span></div><br>`;
      // comments.innerHTML += newPlacemark.commentContent;


      clearInputs();


      // newPlacemark.events.add("click", () => {
      //   openBalloon();
      //   comments.innerHTML = newPlacemark.commentContent;

      // });
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
})