<template>
  <v-app>
    <v-app-bar app> <!-- --> </v-app-bar> <!-- Sizes your content based upon application components -->
    <v-main> <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-layout column>
          <v-layout row style="margin-top: 1px">
            <v-col cols="1">
              <v-text-field label="요청지연" id="delay-input" v-model="delay" hide-details outlined type="number"
                            :min=0 :max=6 :rules="delayRules" color="white"/>
            </v-col>
            <v-col cols="2">
              <v-checkbox label="휴대폰번호만 추출" id="mobile-checkbox" v-model="isMobileOnly"/>
            </v-col>
          </v-layout>
          <v-layout row>
            <v-col cols="3">
              <v-list rounded style="height: 700px" class="overflow-y-auto">
                <v-subheader>
                  <v-text-field id="keyword-input" v-model="keyword" @keyup.enter="appendKeyword"
                                label="키워드를 입력하세요"></v-text-field>
                  <v-icon id="refresh-icon" color="green">mdi-refresh</v-icon>
                </v-subheader>
                <v-list-item-group color="primary">
                  <v-list-item v-for="(item, i) in keywordList" :key="i">
                    <v-list-item-content>
                      <v-list-item-title v-text="item"/>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon>
                        <v-icon color="purple" @click="removeFromList(i)">mdi-close</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col cols="9">
              <v-flex style="overflow: auto">
                <v-data-table :headers="headers" :items="company_list" :items-per-page="10000"
                              hide-default-footer
                              height="100%"
                ></v-data-table>
              </v-flex>
            </v-col>
          </v-layout>
        </v-layout>
      </v-container>
    </v-main>
    <v-footer app> <!-- --> </v-footer>
  </v-app>
</template>
<script> export default {
  components: {}, created() {
    this.keywordList.push("바다");
    this.keywordList.push("이야기");
    let dummy = {
      name: '성은네가게',
      address: '천안시 서북구 불당동',
      phone: '041-535-5349',
      mobile: '010-3354-5349',
      category: '식당',
      update_date: '2021-05-18'
    }
    for (let i = 0; i < 9; ++i) {
      this.company_list.push(dummy);
    }
  }, methods: {
    removeFromList(i) {
      console.log(i)
      this.keywordList.splice(i, 1)
      console.log(i)
    }, appendKeyword() {
      this.keywordList.push(this.keyword)
      this.keyword = ""
    },
  }, data: () => ({
    page: 6,
    panel: 0,
    keywordList: [],
    keyword: "",
    delay: 0,
    delayRules: [v => v >= 0],
    isMobileOnly: false,
    headers: [{text: '업체명', align: 'start', sortable: false, value: 'name',}, {
      text: '주소',
      value: 'address'
    }, {text: '전화번호', value: 'phone'}, {text: '휴대폰번호', value: 'mobile'}, {
      text: '업종',
      value: 'category'
    }, {text: '업데이트일', value: 'update_date'}],
    company_list: [{
      name: '성은네가게',
      address: '천안시 서북구 불당동',
      phone: '041-535-5349',
      mobile: '010-3354-5349',
      category: '식당',
      update_date: '2021-05-18'
    }, {
      name: '병성네가게',
      address: '천안시 서북구 백석동',
      phone: '041-535-5348',
      mobile: '010-3354-5348',
      category: '식당',
      update_date: '2021-05-20'
    }],
  }),
} </script>
<style lang="scss"> #app {
  background-color: #1f1e2e;
}

#app > div > main > div > div > div > div.layout.row > div.col.col-3 > div > div.v-subheader.theme--light > div > div > div.v-input__slot > div > label {
  color: white;
  font-size: 13px;
}

.v-text-field--outlined fieldset {
  color: rebeccapurple !important;
}

.theme--light.v-label {
  color: white !important;
}

#app > div > main > div > div > div > div.flex > div > div > div > div > label {
  color: white;
}

#delay-input {
  color: white;
  background-color: #272a3d;
  border: 10px rebeccapurple;

  label {
    color: white;
  }
}

#mobile-checkbox {
  background-color: #00e676;
}

#keyword-input {
  color: white;
}

#app > div > main > div > div > div > div.layout.row > div.col.col-3 > div {
  background-color: #272a3d !important;
  color: white !important;
}

.v-toolbar__content {
  background-color: #1f1e2e;
  color: white !important;
}

.v-list-item__content {
  color: white;
}

.v-list-item {
  min-height: 15px !important;
  height: 35px;
  border: 1px solid gray;
}

.v-data-footer {
  position: absolute;
  bottom: 35px;
  width: 80.2%;
}

.theme--light.v-data-table {
  height: 900px;
  background-color: #272a3d !important;
  color: white !important;
  thead {
    th {
      background-color: #272a3d !important;
      color: white !important;
    }
  }
  tbody {
    tr {
      background-color: #272a3d !important;
      color: white !important;
    }
    tr:hover {
      background-color: #8195c7 !important;
    }
  }
}

.theme--light.v-icon {
  color: gray !important;
}

//input[id="mobile-checkbox"] + label {
//  display: inline-block;
//  width: 20px;
//  height: 20px;
//  border: 2px solid #bcbcbc;
//  cursor: pointer;
//}

.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
  color: #cacccb;
  font-weight: bold;
  font-size: 18px;
}

.v-data-table__wrapper {
  margin-bottom: 60px;
} </style>
