<script setup lang="ts">
import VueMultiselect from "vue-multiselect";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { AppStore } from "../../store/AppStore.ts";

const { t } = useI18n({ useScope: "global" });
const App = AppStore();

defineEmits(["sendOrder"]);
const orderData = ref({
  first_name: "",
  second_name: "",
  patronymic: "",
  email: "",
  phone: "",
  delivery_type: "delivery",
  country: "",
  city: "",
  street_name: "",
  zip_code: "",
  comment: "",
  base64_data: "",
});
const en_options = [
  "United States",
  "Canada",
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and/or Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Croatia (Hrvatska)",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecudaor",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands (Malvinas)",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "France, Metropolitan",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard and Mc Donald Islands",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran (Islamic Republic of)",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, Democratic People's Republic of",
  "Korea, Republic of",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People's Democratic Republic",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libyan Arab Jamahiriya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia, Federated States of",
  "Moldova, Republic of",
  "Monaco",
  "Mongolia",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfork Island",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russian Federation",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia South Sandwich Islands",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "St. Helena",
  "St. Pierre and Miquelon",
  "Sudan",
  "Suriname",
  "Svalbarn and Jan Mayen Islands",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States minor outlying islands",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City State",
  "Venezuela",
  "Vietnam",
  "Virigan Islands (British)",
  "Virgin Islands (U.S.)",
  "Wallis and Futuna Islands",
  "Western Sahara",
  "Yemen",
  "Yugoslavia",
  "Zaire",
  "Zambia",
  "Zimbabwe",
];
const ru_options = [
  "Афганистан",
  "Албания",
  "Антарктика",
  "Алжир",
  "Американское Самоа",
  "Андора",
  "Ангола",
  "Антигуа и Барбуда",
  "Азербайджан",
  "Аргентина",
  "Австралия",
  "Австрия",
  "Багамские Острова",
  "Бахрейн",
  "Бангладеш",
  "Армения",
  "Барбадос",
  "Бельгия",
  "Бермудские Острова",
  "Бутан",
  "Боливия",
  "Босния и Герцеговина",
  "Ботсвана",
  "Остров Буве",
  "Бразилия",
  "Белиз",
  "Британская территория в Индийском океане",
  "Соломоновы Острова",
  "Британские Виргинские острова",
  "Бруней",
  "Болгария",
  "Мьянма",
  "Бурунди",
  "Белоруссия",
  "Камбоджа",
  "Камерун",
  "Канада",
  "Кабо-Верде",
  "Каймановы острова",
  "Центральноафриканская Республика",
  "Шри-Ланка",
  "Чад",
  "Чили",
  "Китайская Народная Республика",
  "Остров Рождества",
  "Кокосовые острова",
  "Колумбия",
  "Коморы",
  "Майотта",
  "Республика Конго",
  "Демократическая Республика Конго",
  "Острова Кука",
  "Коста-Рика",
  "Хорватия",
  "Куба",
  "Кипр",
  "Чехия",
  "Бенин",
  "Дания",
  "Доминика",
  "Доминиканская Республика",
  "Эквадор",
  "Сальвадор",
  "Экваториальная Гвинея",
  "Эфиопия",
  "Эритрея",
  "Эстония",
  "Фарерские острова",
  "Фолклендские острова",
  "Южная Георгия и Южные Сандвичевы острова",
  "Фиджи",
  "Финляндия",
  "Аландские острова",
  "Франция",
  "Французская Гвиана",
  "Французская Полинезия",
  "Французские Южные и Антарктические территории",
  "Джибути",
  "Габон",
  "Грузия",
  "Гамбия",
  "Палестина",
  "Германия",
  "Гана",
  "Гибралтар",
  "Кирибати",
  "Греция",
  "Гренландия",
  "Гренада",
  "Гваделупа",
  "Гуам",
  "Гватемала",
  "Гвинея",
  "Гайана",
  "Республика Гаити",
  "Остров Херд и острова Макдональд",
  "Ватикан",
  "Гондурас",
  "Гонконг",
  "Венгрия",
  "Исландия",
  "Индия",
  "Индонезия",
  "Иран",
  "Ирак",
  "Ирландия",
  "Израиль",
  "Италия",
  "Кот-д’Ивуар",
  "Ямайка",
  "Япония",
  "Казахстан",
  "Иордания",
  "Кения",
  "КНДР",
  "Республика Корея",
  "Кувейт",
  "Киргизия",
  "Лаос",
  "Ливан",
  "Лесото",
  "Латвия",
  "Либерия",
  "Ливия",
  "Лихтенштейн",
  "Литва",
  "Люксембург",
  "Макао",
  "Мадагаскар",
  "Малави",
  "Малайзия",
  "Мальдивы",
  "Мали",
  "Мальта",
  "Мартиника",
  "Мавритания",
  "Маврикий",
  "Мексика",
  "Монако",
  "Монголия",
  "Молдавия",
  "Черногория",
  "Монтсеррат",
  "Марокко",
  "Мозамбик",
  "Оман",
  "Намибия",
  "Науру",
  "Непал",
  "Нидерланды",
  "Кюрасао",
  "Аруба",
  "Синт-Мартен",
  "Бонэйр, Синт-Эстатиус и Саба",
  "Новая Каледония",
  "Вануату",
  "Новая Зеландия",
  "Никарагуа",
  "Нигер",
  "Нигерия",
  "Ниуэ",
  "Норфолк",
  "Норвегия",
  "Северные Марианские острова",
  "Внешние малые острова США",
  "Микронезия",
  "Маршалловы Острова",
  "Палау",
  "Пакистан",
  "Панама",
  "Папуа — Новая Гвинея",
  "Парагвай",
  "Перу",
  "Филиппины",
  "Острова Питкэрн",
  "Польша",
  "Португалия",
  "Гвинея-Бисау",
  "Восточный Тимор",
  "Пуэрто-Рико",
  "Катар",
  "Реюньон",
  "Румыния",
  "Россия",
  "Руанда",
  "Сен-Бартелеми",
  "Острова Святой Елены, Вознесения и Тристан-да-Кунья",
  "Сент-Китс и Невис",
  "Ангилья",
  "Сент-Люсия",
  "Сен-Мартен (Франция)",
  "Сен-Пьер и Микелон",
  "Сент-Винсент и Гренадины",
  "Сан-Марино",
  "Сан-Томе и Принсипи",
  "Саудовская Аравия",
  "Сенегал",
  "Сербия",
  "Сейшельские Острова",
  "Сьерра-Леоне",
  "Сингапур",
  "Словакия",
  "Словения",
  "Сомали",
  "Южно-Африканская Республика",
  "Зимбабве",
  "Испания",
  "Южный Судан",
  "Судан",
  "Западная Сахара",
  "Суринам",
  "Шпицберген и Ян-Майен",
  "Свазиленд",
  "Швеция",
  "Швейцария",
  "Сирия",
  "Таджикистан",
  "Таиланд",
  "Того",
  "Токелау",
  "Тонга",
  "Тринидад и Тобаго",
  "Объединённые Арабские Эмираты",
  "Тунис",
  "Турция",
  "Туркмения",
  "Теркс и Кайкос",
  "Тувалу",
  "Уганда",
  "Украина",
  "Республика Македония",
  "Египет",
  "Великобритания",
  "Гернси",
  "Джерси",
  "Остров Мэн",
  "Танзания",
  "Соединённые Штаты Америки",
  "Виргинские Острова",
  "Буркина-Фасо",
  "Уругвай",
  "Узбекистан",
  "Венесуэла",
  "Уоллис и Футуна",
  "Самоа",
  "Йемен",
  "Замбия",
];
</script>

<template>
  <div class="w-full flex p-6">
    <div class="desktop:w-full w-full">
      <form class="grid grid-cols-1 desktop:grid-cols-2 gap-[62px] w-full">
        <div class="flex desktop:flex-row flex-col justify-between items-start">
          <h2 class="font-TT text-3xl w-1/4">
            {{ t("cart.personal_info") }}
          </h2>
          <div class="grid gap-x-6 desktop:w-[323px] w-full mt-6 gap-y-4">
            <input
              v-model="orderData.first_name"
              type="text"
              class="border-black pb-3 border-[#8B8B8B] grow border-b font-arial text-[12px] placeholder-[#6D6D6D]"
              :placeholder="t('cart.first_name')"
            />
            <input
              v-model="orderData.second_name"
              type="text"
              class="border-black pb-3 border-[#8B8B8B] grow border-b font-arial text-[12px] placeholder-[#6D6D6D]"
              :placeholder="t('cart.second_name')"
            />
            <input
              v-model="orderData.patronymic"
              type="text"
              class="border-black pb-3 border-[#8B8B8B] grow border-b font-arial text-[12px] placeholder-[#6D6D6D]"
              :placeholder="t('cart.patronymic')"
            />
            <input
              v-model="orderData.email"
              type="email"
              class="border-black pb-3 border-[#8B8B8B] grow border-b font-arial text-[12px] placeholder-[#6D6D6D]"
              :placeholder="t('cart.email')"
            />
            <input
              v-model="orderData.phone"
              type="tel"
              class="border-black pb-3 border-[#8B8B8B] grow border-b font-arial text-[12px] placeholder-[#6D6D6D]"
              :placeholder="t('cart.phone')"
            />
          </div>
        </div>
        <div
          class="flex w-full desktop:flex-row flex-col justify-between items-start"
        >
          <div class="w-full flex desktop:flex-col gap-[40px] flex-col-reverse">
            <h2 class="font-TT text-3xl">
              {{ t("cart.delivery_address") }}
            </h2>
            <div class="flex desktop:w-[256px] w-full border border-black">
              <div
                @click="orderData.delivery_type = 'delivery'"
                :class="{
                  'bg-black cursor-pointer text-white':
                    orderData.delivery_type == 'delivery',
                }"
                class="border-r border-black w-full py-2 flex justify-center items-center"
              >
                {{ t("cart.delivery") }}
              </div>
              <div
                @click="orderData.delivery_type = 'pickup'"
                :class="{
                  'bg-black cursor-pointer text-white':
                    orderData.delivery_type == 'pickup',
                }"
                class="w-full text-black py-2 flex justify-center items-center"
              >
                {{ t("cart.pickup") }}
              </div>
            </div>
          </div>

          <div class="grid gap-x-6 w-full desktop:w-[323px] mt-6 gap-y-4">
            <VueMultiselect
              v-model="orderData.country"
              :options="App.language == 'ru' ? ru_options : en_options"
              :multiple="false"
              :group-select="true"
              :placeholder="t('cart.country')"
              ><span slot="noResult"
                >Oops! No elements found. Consider changing the search
                query.</span
              >
            </VueMultiselect>
            <input
              v-model="orderData.city"
              type="text"
              class="border-black pb-3 border-[#8B8B8B] grow border-b font-arial text-[12px] placeholder-[#6D6D6D]"
              :placeholder="t('cart.city')"
            />
            <input
              v-model="orderData.street_name"
              type="text"
              class="border-black pb-3 border-[#8B8B8B] grow border-b font-arial text-[12px] placeholder-[#6D6D6D]"
              :placeholder="t('cart.street')"
            />

            <input
              v-model="orderData.zip_code"
              type="text"
              class="border-black pb-3 border-[#8B8B8B] grow border-b font-arial text-[12px] placeholder-[#6D6D6D]"
              :placeholder="t('cart.zip')"
            />

            <input
              v-model="orderData.comment"
              type="text"
              class="border-black pb-3 border-[#8B8B8B] grow border-b font-arial text-[12px] placeholder-[#6D6D6D]"
              :placeholder="t('cart.comment')"
            />
            <div />
          </div>
        </div>
      </form>
      <div
        @click="$emit('sendOrder', orderData)"
        class="w-[324px] mt-12 mx-auto title text-base h-[35px] cursor-pointer hover:bg-black hover:text-white flex justify-center items-center border border-black"
      >
        {{ t("cart.place_order") }}
      </div>
    </div>
  </div>
</template>

<style>
.multiselect {
  border-bottom: 1px solid #6d6d6d !important;
  padding-bottom: 12px;
  position: relative;
}

.multiselect__content-wrapper {
  z-index: 99;
  position: absolute;
  background-color: white;
  width: 100%;
  margin: 16px 0;
}

.multiselect__content {
  width: 100%;
  height: 297.8px;
  overflow-y: scroll;
}

.multiselect__element {
  border-bottom: 1px solid #6d6d6d !important;
  width: 100%;
  padding-bottom: 16px;
}

.multiselect__option {
  display: block;
  width: 100%;
}

.multiselect__placeholder {
  color: rgb(156 163 175);
}
</style>
