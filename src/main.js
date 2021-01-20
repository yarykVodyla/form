import Vue from 'vue'
import App from './App.vue'
import Addition from "./components/Addition"
import Video from "./components/Video"

// var eventBus = new Vue();
window.eventBus = new Vue();

Vue.config.productionTip = false;
// Taking all form divs
let els = document.querySelectorAll('.app');
// Creating additionalContainer to render vue there
let additionalContainer = document.createElement('div');
additionalContainer.innerHTML = '<div id="additionalContainer"></div>';
document.querySelector('body').appendChild(additionalContainer);
// Taking all video container
let videoElements = document.querySelectorAll('.video-block');

// Init Addition Vue
new Vue({
    el: '#additionalContainer',
    render: h => h(Addition),
    components: {
        Addition
    }
});

// Init all forms Vue
for (let i = 0; i < els.length; i++) {
    let pixel_id,
        pixel_el = document.querySelector('meta[name="pixel_id"]')
    if (pixel_el && pixel_el.getAttribute('content') !== '') {
        pixel_id = document.querySelector('meta[name="pixel_id"]').getAttribute('content');
    } else {
        pixel_id = null
    }

    let langland = document.querySelector('html').getAttribute('lang');
    let butt1 = els[i].getAttribute('data-butt');
    let f_type = els[i].getAttribute('data-type');
    let f_name = els[i].getAttribute('data-name');
    let f_email = els[i].getAttribute('data-email');



    let lang = langland.toUpperCase();
    let geo = ['RU'];
    let uri = null;
    let termsCheck = false;
    if (els[i].hasAttribute('data-url')) {
        uri = els[i].getAttribute('data-url');
    }
    if (els[i].hasAttribute('data-geo')) {
        if(els[i].getAttribute('data-geo') == 'RUEU'){
            geo = ['GB','CA','CF','CH','CZ','HR','EE','FI','FK','FR','LV','LT','LI','LU','ME','MK','MY','MC','NL','NZ','NO','PL','PT','RS','SG','SK','SI','SE','SG','TR','ZA'];
        }else if(els[i].getAttribute('data-geo') == 'AR'){
            geo = ['AE','BH',  'KW', 'OM', 'QA', 'SA'];
        }
    }
    if (els[i].getAttribute('data-terms') !== null) {
        termsCheck = els[i].getAttribute('data-terms');
    }
    new Vue({
        data: {geo, uri, lang, butt1, pixel_id, langland, f_type, f_name, f_email, termsCheck},
        el: '#' + els[i].getAttribute('id'),
        render: h => h(App),
        created() {
            eventBus.$emit('langInit', this.lang);
        }
    })
}

// Init all videos vue
for (let i = 0; i < videoElements.length; i++) {
    let videocode = videoElements[i].getAttribute('data-video');
    let videoHeight = videoElements[i].getAttribute('data-height');

    new Vue({
        data: { videocode, videoHeight },
        el: videoElements[i],
        render: h => h(Video)
    })
}
