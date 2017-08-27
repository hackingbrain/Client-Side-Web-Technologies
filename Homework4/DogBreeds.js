/**
 * Created by sijieliang on 5/2/17.
 */


/**
 * Initialize the function
 */
fetchBreed();


/**
 * Create a function to get the breed from dropdown menu
 */
function fetchBreed() {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {

        if (xhr.readyState === XMLHttpRequest.DONE) {

            if (( 200 <= xhr.status && xhr.status < 300 ) || xhr.status === 304) {

                let data = JSON.parse(xhr.responseText);
                let select = document.getElementById("selectedBreed");
                select.innerHTML = "";

                data.forEach(
                    function (val, index, array) {
                        let option = document.createElement("option");
                        option.id = val.id;
                        option.innerHTML = val.name;
                        select.appendChild(option);
                    }
                );
                document.getElementById("selectedBreed").addEventListener("change", onchange, false);
                onchange();
            } else {
                alert("Error: " + xhr.status);
            }
            xhr = null;
        }
    };
    xhr.open("get", "http://csw08724.appspot.com/breeds.ajax", true);
    xhr.send(null);

};


/**
 * Create a function to display the content based on the selected breed
 */
function onchange() {
    // Show the selected breed
    let selected = document.getElementById("selectedBreed");
    document.getElementById("BreedName").innerHTML = selected.options[selected.selectedIndex].value;


     //If a different breed is selected, clear the timer

    if (typeof (tm) != 'undefined') {
        tm = clearInterval(tm);
    }

     //Create the content body

    createLayoutBody(selected.options[selected.selectedIndex].id);

};

/**
 * Create a function to show the sections of Description, Origins, Right for You?, and image slideshow based on the id of selected breed
 * @param id
 */
function createLayoutBody(id) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (( 200 <= xhr.status && xhr.status < 300 ) || xhr.status === 304) {

                let data = JSON.parse(xhr.responseText);
                let layout = document.getElementById("Content");
                layout.innerHTML = "";


                // Section for Description
                let subtitile1 = document.createElement("h3");
                subtitile1.innerHTML = "Description";
                let subcontent1 = document.createElement("p");
                subcontent1.innerHTML = data.description;
                layout.appendChild(subtitile1);
                layout.appendChild(subcontent1);


                // Section for Origins
                let subtitile2 = document.createElement("h3");
                subtitile2.innerHTML = "Origins";
                let subcontent2 = document.createElement("p");
                subcontent2.innerHTML = data.origins;
                layout.appendChild(subtitile2);
                layout.appendChild(subcontent2);

                // Section for Right for You?
                let subtitile3 = document.createElement("h3");
                subtitile3.innerHTML = "Right for You?";
                let subcontent3 = document.createElement("p");
                subcontent3.innerHTML = data.rightForYou;
                layout.appendChild(subtitile3);
                layout.appendChild(subcontent3);

                // Store images from a specific breed
                let show = document.getElementById("wrapper");
                show.innerHTML = "";
                let prefix = "http://csw08724.appspot.com/";
                let imgset = [];
                for (let i = 0; i < data.imageUrls.length; i++) {
                    let imgstr = data.imageUrls[i];

                    var img = document.createElement("img");
                    img.src = prefix + imgstr;
                    imgstr = prefix + imgstr;
                    img.setAttribute("class", "slide");
                    show.appendChild(img);
                    imgset.push(imgstr);

                }

                let imgsetlength = imgset.length;

                // Create the slideshow
                run();
                function run() {
                    var element = "#main-slider";
                    var item = document.querySelector(element);
                    var pics = item.querySelectorAll(".slide");
                    init();

                    function init() {
                        var current = 0;
                        startslides();

                        function startslides() {
                                tm = setInterval(function () {
                                if (current >= imgsetlength) {
                                    current = 0;
                                }
                                // If it is the current picture, make it visible
                                var currentPic = pics[current];
                                currentPic.style.opacity = 1;

                                // if it is not the current picture, make it transparent
                                for (var i = 0; i < imgsetlength; i++) {
                                    var slide = pics[i];
                                    if (slide !== currentPic) {
                                        slide.style.opacity = 0;
                                    }
                                }
                                current += 1;
                            }, 5000);
                        }
                    }
                }

            } else {
                alert("Error: " + xhr.status);
            }
            xhr = null;
        }
    };
    xhr.open("get", "http://csw08724.appspot.com/breed.ajax" + "?id=" + id, true);
    xhr.send(null);
}



