<template>
    <div>
        <form :action="action" :id="'form'+id" :method="method" v-bind:class="lang === 'AR' ? 'arForm' : ''">
            <div class="step">
                <div class="input-wrap">
                    <!--                    :readonly="f_type == 2 && !testing && f_type != 4 ? 'readonly' : false"-->
                    <input type="text" name="f_name"
                           :id="'f_name'+id"
                           :placeholder="placeholders[formLang].f_name"
                           :value="f_name" @input="nameVal"
                           v-bind:class="valid.f_name == true ? 'valid': valid.f_name == false  ? 'false' : ''">
                    <label :for="'f_name'+id" v-html="errorsUnswers[formLang].f_name"></label>
                    <span class="focus-border"
                          v-bind:class="valid.f_name == true ? 'valid': valid.f_name == false  ? 'false' : ''"><i></i></span>
                </div>
                <div class="input-wrap" v-if="f_type != 1">
                    <input type="text" name="l_name"
                           :id="'l_name'+id"
                           :placeholder="placeholders[formLang].l_name"
                           :value="l_name" @input="surnVal"
                           v-bind:class="valid.l_name == true ? 'valid': valid.l_name == false  ? 'false' : ''">
                    <label :for="'l_name'+id" v-html="errorsUnswers[formLang].l_name"></label>
                    <span class="focus-border"
                          v-bind:class="valid.l_name == true ? 'valid': valid.l_name == false  ? 'false' : ''"><i></i></span>
                </div>
                <div class="input-wrap">
                    <input type="email" name="email"
                           :id="'email'+id"
                           :placeholder="placeholders[formLang].email"
                           v-model="email"
                           @input="emailCheck"
                           v-bind:class="valid.email == true ? 'valid': valid.email == false  ? 'false' : ''">
                    <label :for="'email'+id">{{errorCheck ? errorsUnswers[formLang].email2 : errorsUnswers[formLang].email}}</label>
                    <span class="focus-border"
                          v-bind:class="valid.email == true ? 'valid': valid.email == false  ? 'false' : ''"><i></i></span>
                </div>
            </div>
            <div class="step" v-if="f_type == 2">
                <div class="input-wrap">
                    <vue-tel-input v-model="phone"
                                   v-bind="bindProps"
                                   @input="onInput"
                                   @focus="focusIn = !focusIn"
                                   @blur="focusIn = !focusIn"
                                   v-on:country-changed="countryChanged"></vue-tel-input>
                    <label v-bind:class="valid.phone == true ? 'valid': valid.phone == false  ? 'false' : ''"
                            v-if="focusIn">{{errorCheck ? errorsUnswers[formLang].phone2 : errorsUnswers[formLang].phone}}</label>
                    <span class="focus-border"
                          v-bind:class="valid.phone == true ? 'valid': valid.phone == false  ? 'false' : ''"><i></i></span>
                </div>
            </div>
            <div class="checkbox-wrap" v-if="termsCheck">
                <input type="checkbox" name="terms" :id="'terms'+id" checked="checked">
                <label :for="'terms'+id">Согласен с <a href="javascript:void(0)" @click='formsPolicyClick($event)' class="alterlink" data-name="ruTerms">Условиями использания персональных данных</a></label>
            </div>
            <div class="checkbox-wrap">
                <input type="checkbox" name="politics" :id="'politics'+id" checked="checked">
                <label :for="'politics'+id">{{inform[formLang].agree}} <a href="javascript:void(0)" @click='formsPolicyClick($event)' class="alterlink" data-name="policy">{{inform[formLang].policy}}</a></label>
            </div>
            <div class="checkbox-wrap">
                <input type="checkbox" name="over" :id="'over'+id" checked="checked">
                <label :for="'over'+id">{{inform[formLang].over}}</label>
            </div>
            <input type="hidden" name="pixel_id" v-model="pixel_id">
            <input type="hidden" name="phone2" v-model="wholeNumber" v-if="f_type != 1">
            <input type="hidden" name="url_params" v-model="hiddenSearch">
            <div class="input-wrap">
                <button type="submit" @click="formCheck" v-html="butt"></button>
            </div>
        </form>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueTelInput from 'vue-tel-input'
    import axios from 'axios'
    import VModal from 'vue-js-modal'

    // We are working with ESM.JS vue tel input
    Vue.use(VueTelInput);
    Vue.use(VModal, {dynamic: true, injectModalsContainer: true});

    let test = document.querySelector('html').classList.contains('test');
    let white = document.querySelector('html').classList.contains('page');
    export default {
        name: 'Forms',
        props: ['geo', 'uri', 'lang', 'butt1', 'pixel_id', 'langland', 'f_type', 'inp_name', 'inp_email', 'termsCheck'],
        data() {
            let id = Math.round(Math.random() * (1000 - 100000) + 1000);
            return {
                loader: '<div class="preloader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><span class="inform"></span>',
                id: id,
                formLang: this.lang, // Made for translations of missing languages, but prop still used for sending and form class
                inform: {
                    RU: {
                        '1': 'Поиск свободной лицензии',
                        '2': 'Создание индивидуального аккаунта',
                        '3': 'Бронирование',
                        '4': 'Регистрация..',
                        'agree': 'Я согласен с',
                        'policy': 'Политикой Конфиденциальности',
                        'over': 'Мне больше 18 лет',
                        'phone': 'ВВЕДИТЕ СВОЙ НОМЕР ТЕЛЕФОНА',
                        'nessesary': 'Почему это важно? Мы свяжемся с вами в ближайшее время, чтобы объяснить ваш следующий шаг и как получить вашу первую прибыль сегодня.'
                    },
                    IT: {
                        '1': '',
                        '2': '',
                        '3': '',
                        '4': '',
                        'agree': 'I аgree to',
                        'policy': 'Privacy Policy',
                        'over': 'I am over 18 years',
                        'phone': 'INSERIRE NUMERO DI TELEFONO',
                        'nessesary': 'Perché è importante? Ti contatteremo a breve per spiegare il tuo prossimo passo e come ottenere il tuo primo profitto oggi.'
                    },
                    EN: {
                        '1': 'Search for a free license',
                        '2': 'Create an individual account',
                        '3': 'Reservation',
                        '4': 'Registration..',
                        'agree': 'I аgree to',
                        'policy': 'Privacy Policy',
                        'over': 'I am over 18 years',
                        'phone': 'INSERT PHONE NUMBER',
                        'nessesary': 'Why is it important? We will contact you shortly to explain your next step and how to get your first profit today.'
                    },
                    DE: {
                        '1': 'Search for a free license',
                        '2': 'Create an individual account',
                        '3': 'Reservation',
                        '4': 'Registration..',
                        'agree': 'I аgree to',
                        'policy': 'Privacy Policy',
                        'over': 'I am over 18 years',
                        'phone': 'INSERT PHONE NUMBER',
                        'nessesary': 'Why is it important? We will contact you shortly to explain your next step and how to get your first profit today.'
                    },
                    ES: {
                        '1': 'Search for a free license',
                        '2': 'Create an individual account',
                        '3': 'Reservation',
                        '4': 'Registration..',
                        'agree': 'I аgree to',
                        'policy': 'Privacy Policy',
                        'over': 'I am over 18 years',
                        'phone': 'INSERT PHONE NUMBER',
                        'nessesary': 'Why is it important? We will contact you shortly to explain your next step and how to get your first profit today.'
                    },
                    AR: {
                        '1': '',
                        '2': '',
                        '3': '',
                        '4': '',
                        'agree': 'أنا أتفق مع',
                        'policy': 'اتفاقية العميل',
                        'over': 'أنا فوق 18 سنة',
                        'phone': ' الحقل مطلوب ـ ',
                        'nessesary': 'Why is it important? We will contact you shortly to explain your next step and how to get your first profit today.'
                    }
                },
                placeholders: {
                    RU: {
                        'f_name': 'Введите имя',
                        'l_name': 'Введите фамилию',
                        'email': 'Введите электронный адрес',
                    },
                    IT: {
                        'f_name': 'Inserire nome',
                        'l_name': 'Inserire cognome',
                        'email': 'Inserire email',
                        'phone': 'Inserire numero di telefono',
                    },
                    EN: {
                        'f_name': 'Insert name',
                        'l_name': 'Insert last name',
                        'email': 'Insert email',
                        'phone': 'Insert phone number',
                    },
                    DE: {
                        'f_name': 'Namen eingeben',
                        'l_name': 'Nachnamen eingeben',
                        'email': 'E-Mail Adresse eingeben',
                    },
                    ES: {
                        'f_name': 'Introduzca su nombre',
                        'l_name': 'Introduzca el apellido',
                        'email': 'Introducir la dirección de correo electrónico',
                    },
                    AR: {
                        'f_name': 'الإسم',
                        'l_name': 'لقب',
                        'email': 'البريد الإلكتروني',
                        'phone': 'رقم الهاتف',
                    },
                },
                errorsUnswers: {
                    RU: {
                        'f_name': 'Имя должно состоять из более чем 2-х символов, без специальных символов и пробелов',
                        'l_name': 'Фамилия должна состоять из более чем 2-х символов, без специальных символов и пробелов',
                        'email': 'Электронный адрес должен быть действительным адресом',
                        'email2': 'Данный электронный адрес уже зарегистрирован в системе. Введите другой.',
                        'phone': 'Поле телефонного номера является обязательным для заполнения',
                        'phone2': 'Данный номер уже зарегистрирован в системе. Введите другой номер.',
                    },
                    IT: {
                        'f_name': 'Inserire nome',
                        'l_name': 'Inserire cognome',
                        'email': 'Inserire email',
                        'email2': 'Inserire email',
                        'phone': 'Inserire numero di telefono',
                        'phone2': 'Inserire numero di telefono',
                    },
                    EN: {
                        'f_name': 'Insert name',
                        'l_name': 'Insert last name',
                        'email': 'Insert email',
                        'email2': 'Insert email',
                        'phone': 'Insert phone number',
                        'phone2': 'Insert phone number',
                    },
                    DE: {
                        'f_name': 'Der Name muss aus mehr als 2 Zeichen ohne Sonderzeichen und Leerzeichen bestehen',
                        'l_name': 'Der Nachname muss aus mehr als 2 Zeichen ohne Sonderzeichen und Leerzeichen bestehen',
                        'email': 'Die E-Mail-Adresse muss eine gültige Adresse sein',
                        'email2': 'Die E-Mail-Adresse muss eine gültige Adresse sein',
                        'phone': 'Das Telefonnummernfeld ist erforderlich',
                        'phone2': 'Das Telefonnummernfeld ist erforderlich',
                    },
                    ES: {
                        'f_name': 'El nombre debe constar de más de 2 caracteres, sin caracteres y espacios especiales',
                        'l_name': 'El apellido debe constar de más de 2 caracteres, sin caracteres y espacios especiales',
                        'email': 'La dirección de correo electrónico debe ser una dirección válida',
                        'email2': 'La dirección de correo electrónico debe ser una dirección válida',
                        'phone': 'El campo del número de teléfono es obligatorio',
                        'phone2': 'El campo del número de teléfono es obligatorio',
                    },
                    AR: {
                        'f_name': 'الحقل مطلوب ـ <br>طول الاسم ـ <br>على الأقل حرفين ـ <br> يجب أن يحتوي الحقل على أحرف فقط',
                        'l_name': 'الحقل مطلوب ـ <br>طول الاسم ـ <br>على الأقل حرفين ـ <br> يجب أن يحتوي الحقل على أحرف فقط',
                        'email': '- يجب أن يحتوي الحقل على عنوان بريد إلكتروني صالح',
                        'email2': '- يجب أن يحتوي الحقل على عنوان بريد إلكتروني صالح',
                        'phone': '- تم إدخال الرقم بشكل غير صحيح',
                        'phone2': '- تم إدخال الرقم بشكل غير صحيح',
                    }
                },
                wholeNumber: null,
                phone: "",
                method: 'POST',
                once: true,
                hiddenSearch: '',
                urlParams: '',
                f_name: '',
                l_name: '',
                errorCheck: false,
                focusIn: false,
                email: '',
                butt: '',
                testing: test,
                popText: null,
                valid: {
                    phone: null,
                    email: null,
                    f_name: null,
                    l_name: null,
                },
                bindProps: {
                    // mode: "international",
                    dynamicPlaceholder: true,
                    enabledCountryCode: true,
                    disabledFormatting: false,
                    placeholder: "",
                    enabledFlags: true,
                    autocomplete: "on",
                    mode: 'significant',
                    // ignoredCountries: ['UA'],
                    name: "phone",
                    inputId: "phone"+id,
                    validCharactersOnly: true,
                    preferredCountries: this.geo,
                    required: true,
                    maxLen: 15,
                    wrapperClasses: "",
                    dropdownOptions: {
                        disabledDialCode: false
                    },
                    inputOptions: {
                        showDialCode: false
                    },

                },
                action: null
            }
        },
        created() {
            // If we have no such language in translations resetting to EN
            if (this.inform[this.lang] === undefined || typeof this.inform[this.lang] === 'undefined') {
                this.formLang = 'EN';
            }
            // console.log(this.validate);
            this.butt = this.butt1;
            this.action = this.uri != null ? this.uri : this.f_type === '1' ? 'members' : 'thankyou'
            this.inp_name ? this.f_name = this.inp_name : '';
            this.inp_email ? this.email = this.inp_email : '';

            if (this.f_type === '2') {
                // Giving f_name and email validated status on second page (the field is green and check mark inside input)
                this.inp_name ? this.valid.f_name = true : '';
                this.email ? this.valid.email = true : '';

                // Inserting fbclid and pixel_id in action
                window.specialParamsInserted = true;
            }

            this.paramsGet();

            if (this.checkDataUrlParams()) {
                if (this.parseParams() !== '') {
                    this.action += '&' + this.parseParams()
                }
            } else {
                if (this.parseParams() !== '') {
                    this.action += '?' + this.parseParams()
                }
            }
            // Snippet for regular videos
            let playBtns = document.querySelectorAll('.play-btn');

            if (window.helloVideoStateFlag === undefined || typeof window.helloVideoStateFlag === 'undefined') {
                window.helloVideoStateFlag = true;
                for (var i = 0; i < playBtns.length; i++) {
                    playBtns[i].addEventListener('click', function () {
                        let videoEl = this.parentNode.querySelector('video');
                        if (videoEl.paused) {
                            videoEl.play();
                            this.parentNode.classList.add('play')
                        } else {
                            videoEl.pause();
                            this.parentNode.classList.remove('play')
                        }
                    })
                }
            }
        },
        methods: {
            countryChanged(country) {
                this.country = country.dialCode
            },
            formsPolicyClick(event) {
                this.$emit('formsPolicyClick', event)
            },
            paramsGet() {
                let s = location.search;
                if (s !== '') {
                    // preparing params from url to add it to action in parseParams func
                    s = s.replace(/\?/, '');
                    this.urlParams = s.replace(/&/g, '**');
                    this.urlParams = this.urlParams.replace(/=/g, '*');

                    // putting url params into input
                    let subs = {}
                    let split1 = s.split('&');
                    for (let i = 0; i < split1.length; i++) {
                        let split2 = split1[i].split('=');
                        subs[split2[0]] = split2[1]
                    }
                    this.hiddenSearch = JSON.stringify(subs)
                }
            },
            checkDataUrlParams() {
                // Check if data url has params
                let actionParams = this.action.split('?')[1];
                return actionParams !== undefined && typeof actionParams !== 'undefined';
            },
            parseParams() {
                // func to return params for inserting into action
                let params='';
                if (this.urlParams !== '') {
                  let splited = this.urlParams.split('**');
                  for (let i = 0; i < splited.length; i++) {
                    let splited2 = splited[i].split('*');
                    params += '&' + splited2[0] + '=' +  splited2[1]
                  }
                  params = params.slice(1,params.length);
                  return params
                } else {
                  return ''
                }
            },
            onInput(formattedNumber, {number, valid, country}) {
                if (this.pixel_id && this.once && !test) {
                    this.once = false;
                    this.fbEvent('InitiateCheckout')
                }
                if (number.international) {
                    this.wholeNumber = number.international.replace(/[\s-+]/g, '');
                    this.valid.phone = valid;
                    this.bindProps.inputClasses = valid ? 'valid' : 'false'
                }
            },
            nameVal(evt) {
                this.f_name = evt.target.value;
                this.nameCheck();
            },
            nameCheck() {
                let rep = /^[a-zA-Zа-яА-Я\u0600-\u06FF]*$/; // /^[\p{L}\p{M}\. ]+$/u;
                this.f_name =  this.f_name.replace(/\s/g, '');
                if (this.f_name.length < 2 || !rep.test(this.f_name)) {
                    this.valid.f_name = false;
                } else {
                    this.valid.f_name = true;
                }
            },
            surnVal(evt) {
                this.l_name = evt.target.value;
                this.surnCheck();
            },
            surnCheck() {
                let rep = /^[a-zA-Zа-яА-Я\u0600-\u06FF]*$/;///^[\p{L}\p{M}\. ]+$/u;/

                this.l_name =  this.l_name.replace(/\s/g, '');

                if (this.l_name.length < 3 || !rep.test(this.l_name)) {
                    this.valid.l_name = false;
                } else {
                    this.valid.l_name = true;

                }
            },
            emailCheck() {
                let rep = /^[0-9a-z-\._]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i;
                /*/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;*/
                if (!rep.test(this.email.toLowerCase())) {
                    this.valid.email = false;
                } else {
                    this.valid.email = true;
                }
            },
            formCheck(event) {
                event.preventDefault();
                let _this = this;

                if (this.f_type === '2') {
                    if (this.valid.phone && this.valid.email && this.valid.f_name && this.valid.l_name) {
                        _this.submitForm();
                    } else {
                        _this.emailCheck();
                        _this.nameCheck();
                        _this.surnCheck();
                        if (!this.valid.phone) {
                            this.valid.phone = false;
                            this.bindProps.inputClasses = 'false';
                        }
                    }
                } else if (this.f_type === '1') {
                    if (this.valid.email && this.valid.f_name) {
                        document.querySelector('#form' + _this.id).submit();
                    } else {
                        _this.emailCheck();
                        _this.nameCheck()
                    }
                }
            },
            sendAjaxForm() {
                this.token = 'tok_5ea73AfAA78c04.37131434';
                axios.get(this.action, {
                    params: {
                        f_name: this.f_name,
                        l_name: this.l_name,
                        email: this.email,
                        phone2: this.wholeNumber,
                        url_params: this.hiddenSearch,
                        token: this.token
                    }
                })
                    .then(response => {
                        if (typeof response.data === 'object' && (response.data.success === true || response.data.success === 'true')) {
                            this.method = 'POST';
                            this.action = response.data.redirectUrl
                            document.querySelector('#form' + this.id).submit();
                        } else {
                            document.querySelector('#form' + this.id).submit();
                        }
                    })
                    .catch(() => {
                        document.querySelector('#form' + this.id).submit();
                    })
            },
            fbEvent(eventName) {
                let newItem = document.createElement('img');
                newItem.width = '1px';
                newItem.height = '1px';
                newItem.style.display = 'none';
                newItem.src = 'https://www.facebook.com/tr?id=' + this.pixel_id + '&ev=' + eventName + '&noscript=1';
                document.getElementsByTagName("head")[0].prepend(newItem);
            },
            submitForm() {
                // ZAGOTOVKA
                // const promise1 = new Promise((resolve, reject) => {
                //     var img = $('<img />');
                //     img.one('load', function() {
                //         resolve(123)
                //     });
                //     img.attr('src', 'https://www.facebook.com/tr?id=52465456&ev=InitiateCheckout&noscript=1');
                // });
                // ZAGOTOVKA
                this.butt = '<div class="preloader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';

                if (this.pixel_id) this.fbEvent('Lead');
                document.querySelector('#form' + this.id).submit();
            }
        },

    }
</script>
<style lang="scss">
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    /*li {*/
    /*    display: inline-block;*/
    /*    margin: 0 10px;*/
    /*}*/

    a {
        color: #42b983;
    }

    .close-poping {
        position: absolute;
        right: 20px;
        top: 20px;
        font-family: 'Open Sans', Helvetica, Arial, sans-serif;
        font-size: 16px;
        cursor: pointer;
    }
    input {
        box-sizing: border-box;
        background-color: #fff;
    }
    input:not([type=checkbox]) {
        width: 100%;
        height: 30px;
        outline: none;
        position: relative;
        z-index: 3;
        background-position: 50% 50%;
        background-repeat: no-repeat!important;
        border: 1px solid #999;
    }
    button[type="submit"] {
        width: 100%;
        padding: 15px;
        height: auto;
        cursor: pointer;
    }
    #phone.false,
    input.false {
        /*background-color: #fff;*/
        background-image: url("../../public/error-info.svg") !important;
        background-position: 99% 50%;
        background-repeat: no-repeat;
        border: 1px solid #CF0000;
        /*transition: background-position .5s linear;*/
        transition: unset;
        /*background-color: rgb(207 0 0 / 10%)!important*/
        background-color: #ffe3e3!important;
    }

    input.valid {
        /*background-color: #fff;*/
        background-image: url("../../public/valid-info.svg") !important;
        background-position: 99% 50%;
        background-repeat: no-repeat;
        border: 1px solid #23B100;
        /*background-color: rgb(35 177 0 / 10%)!important;*/
        background-color: #eaffe5!important;
    }
    form input.valid,
    form input.false,
    form input.valid:focus,
    form input.false:focus {
        color: #444;
        /*background-color: #fff!important;*/
    }
    form .input-wrap {
        width: 100%;
        position: relative;
        margin: 20px 0;
    }

    .input-wrap label {
        position: absolute;
        display: none;
    }

    .checkbox-wrap {
        font-family: 'Open Sans', Helvetica, Arial, sans-serif;
        font-size: 14px;
    }
    .checkbox-wrap input,
    .checkbox-wrap label {
        vertical-align: middle;
    }
    .checkbox-wrap label {
        box-sizing: border-box;
        max-width: 95%;
        margin: 0;
        padding-left: 5px;
    }
    label.false,
    .input-wrap input.false:focus + label {
        display: block;
        text-align: center;
        color: #C40000;
        font-size: 14px;
        position: absolute;
        width: 54%;
        max-width: 200px;
        z-index: 999;
        background: #FFFFFF;
        bottom: 99%;
        right: 0%;
        padding: 2px;
        border-radius: 8px;
        border: 1px solid #FFFFFF;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        font-family: 'Open Sans', Helvetica, Arial, sans-serif;
        font-style: normal;
        font-weight: normal;
    }

    label.false:after,
    input.false:focus + label:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border: 10px solid;
    }

    label.false:after,
    input.false:focus + label:after {
        border-color: #ffffff transparent transparent transparent;
        top: 100%;
        right: 7.1%;
        margin-left: -10px;
    }


    .focus-border.valid,
    .focus-border.false {
        display: block;
        position: absolute;
        width: 80%;
        top: -2px;
        bottom: -2px;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 1;
    }

    .focus-border.valid:before,
    .focus-border.valid:after,
    .focus-border.false:before,
    .focus-border.false:after {
        width: 100%;
        transition: 0.3s;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 2px;
    }

    .focus-border.valid:after,
    .focus-border.false:after {
        top: auto;
        bottom: 0;
    }

    .focus-border.false:before,
    .focus-border.false:after {
        background-color: #CF0000;
    }

    .focus-border.valid:before,
    .focus-border.valid:after {
        background-color: #23B100;
    }

    .pop-text-wrap {
        padding: 50px 70px;
    }

    .focus-border {
        z-index: -1 !important;
    }

    .vti__dropdown.open {
        z-index: 99
    }
    /*form .vti__dropdown {*/
    /*    background-color: #f3f3f3;*/
    /*}*/
/*  ARABIAN DICH  */
    .arForm {
        input {
            direction: rtl;
            text-align: center;
        }
        /*label.false,
        .input-wrap input.false:focus + label {
            right: auto;
            left: 0;
        }
        label.false:after, input.false:focus + label:after {
            right: auto;
            left: 4.1%;
            margin-left: unset;
            margin-right: -10px;
        }
        input.valid,
        input.false {
            background-position: 17px!important;
        }*/
        .checkbox-wrap {
            text-align: right;
            direction: rtl;
        }
        .vti__dropdown {
            order: 1;
            direction: ltr;
        }
        input[name='phone'] {
            text-align: left;
            order: 2;
            direction: ltr!important;
            background-position: 99% 50% !important;
        }
        input[name='email'] {
            direction: ltr!important;
        }
    }
    /*LOADER*/

    .loaders {
        font-size: 20px;
        display: flex;
        align-items: center;
        left: 0;
        top: 0;
        position: fixed;
        width: 100%;
        z-index: 9999999;
        justify-content: center;
        height: 100vh;
        background-color: #06c
    }

    .loaders-bg-2 {
        background-color: #fc4532
    }

    .loaders-bg-3 {
        background-color: #ff29c8
    }

    .loaders-bg-4 {
        background-color: #000
    }

    .preloader {
        width: 100px;
        height: 100px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        animation: rotatePreloader 2s infinite ease-in
    }
    button .preloader {
        width: 20px;
        height: 20px;
    }

    .inform {
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        top: 65%;
        text-align: center;
        color: #fff;
        font-size: 14px;
    }

    @keyframes rotatePreloader {
        0% {
            transform: translateX(-50%) translateY(-50%) rotateZ(0)
        }
        100% {
            transform: translateX(-50%) translateY(-50%) rotateZ(-360deg)
        }
    }

    .preloader div {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0
    }

    .preloader div:before {
        content: "";
        position: absolute;
        left: 50%;
        top: 0;
        width: 10%;
        height: 10%;
        background-color: #fff;
        transform: translateX(-50%);
        border-radius: 50%
    }

    .preloader div:nth-child(1) {
        transform: rotateZ(0);
        animation: rotateCircle1 2s infinite linear;
        z-index: 9
    }

    @keyframes rotateCircle1 {
        0% {
            opacity: 0
        }
        0% {
            opacity: 1;
            transform: rotateZ(36deg)
        }
        7% {
            transform: rotateZ(0)
        }
        57% {
            transform: rotateZ(0)
        }
        100% {
            transform: rotateZ(-324deg);
            opacity: 1
        }
    }

    .preloader div:nth-child(2) {
        transform: rotateZ(36deg);
        animation: rotateCircle2 2s infinite linear;
        z-index: 8
    }

    @keyframes rotateCircle2 {
        5% {
            opacity: 0
        }
        5.0001% {
            opacity: 1;
            transform: rotateZ(0)
        }
        12% {
            transform: rotateZ(-36deg)
        }
        62% {
            transform: rotateZ(-36deg)
        }
        100% {
            transform: rotateZ(-324deg);
            opacity: 1
        }
    }

    .preloader div:nth-child(3) {
        transform: rotateZ(72deg);
        animation: rotateCircle3 2s infinite linear;
        z-index: 7
    }

    @keyframes rotateCircle3 {
        10% {
            opacity: 0
        }
        10.0002% {
            opacity: 1;
            transform: rotateZ(-36deg)
        }
        17% {
            transform: rotateZ(-72deg)
        }
        67% {
            transform: rotateZ(-72deg)
        }
        100% {
            transform: rotateZ(-324deg);
            opacity: 1
        }
    }

    .preloader div:nth-child(4) {
        transform: rotateZ(108deg);
        animation: rotateCircle4 2s infinite linear;
        z-index: 6
    }

    @keyframes rotateCircle4 {
        15% {
            opacity: 0
        }
        15.0003% {
            opacity: 1;
            transform: rotateZ(-72deg)
        }
        22% {
            transform: rotateZ(-108deg)
        }
        72% {
            transform: rotateZ(-108deg)
        }
        100% {
            transform: rotateZ(-324deg);
            opacity: 1
        }
    }

    .preloader div:nth-child(5) {
        transform: rotateZ(144deg);
        animation: rotateCircle5 2s infinite linear;
        z-index: 5
    }

    @keyframes rotateCircle5 {
        20% {
            opacity: 0
        }
        20.0004% {
            opacity: 1;
            transform: rotateZ(-108deg)
        }
        27% {
            transform: rotateZ(-144deg)
        }
        77% {
            transform: rotateZ(-144deg)
        }
        100% {
            transform: rotateZ(-324deg);
            opacity: 1
        }
    }

    .preloader div:nth-child(6) {
        transform: rotateZ(180deg);
        animation: rotateCircle6 2s infinite linear;
        z-index: 4
    }

    @keyframes rotateCircle6 {
        25% {
            opacity: 0
        }
        25.0005% {
            opacity: 1;
            transform: rotateZ(-144deg)
        }
        32% {
            transform: rotateZ(-180deg)
        }
        82% {
            transform: rotateZ(-180deg)
        }
        100% {
            transform: rotateZ(-324deg);
            opacity: 1
        }
    }

    .preloader div:nth-child(7) {
        transform: rotateZ(216deg);
        animation: rotateCircle7 2s infinite linear;
        z-index: 3
    }

    @keyframes rotateCircle7 {
        30% {
            opacity: 0
        }
        30.0006% {
            opacity: 1;
            transform: rotateZ(-180deg)
        }
        37% {
            transform: rotateZ(-216deg)
        }
        87% {
            transform: rotateZ(-216deg)
        }
        100% {
            transform: rotateZ(-324deg);
            opacity: 1
        }
    }

    .preloader div:nth-child(8) {
        transform: rotateZ(252deg);
        animation: rotateCircle8 2s infinite linear;
        z-index: 2
    }

    @keyframes rotateCircle8 {
        35% {
            opacity: 0
        }
        35.0007% {
            opacity: 1;
            transform: rotateZ(-216deg)
        }
        42% {
            transform: rotateZ(-252deg)
        }
        92% {
            transform: rotateZ(-252deg)
        }
        100% {
            transform: rotateZ(-324deg);
            opacity: 1
        }
    }

    .preloader div:nth-child(9) {
        transform: rotateZ(288deg);
        animation: rotateCircle9 2s infinite linear;
        z-index: 1
    }

    @keyframes rotateCircle9 {
        40% {
            opacity: 0
        }
        40.0008% {
            opacity: 1;
            transform: rotateZ(-252deg)
        }
        47% {
            transform: rotateZ(-288deg)
        }
        97% {
            transform: rotateZ(-288deg)
        }
        100% {
            transform: rotateZ(-324deg);
            opacity: 1
        }
    }

    .preloader div:nth-child(10) {
        transform: rotateZ(324deg);
        animation: rotateCircle10 2s infinite linear;
        z-index: 0
    }

    @keyframes rotateCircle10 {
        45% {
            opacity: 0
        }
        45.0009% {
            opacity: 1;
            transform: rotateZ(-288deg)
        }
        52% {
            transform: rotateZ(-324deg)
        }
        102% {
            transform: rotateZ(-324deg)
        }
        100% {
            transform: rotateZ(-324deg);
            opacity: 1
        }
    }
</style>
