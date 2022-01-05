<template>
  <v-app>
    <v-app-bar app st>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn id="notification" style="margin-right:5px; padding-right: 30px">
        <v-icon size="30px" style="color:white !important; padding-right: 10px;">mdi-bell-outline</v-icon>
        <div style="color:white !important;"> 공지</div>
      </v-btn>
      <Login/>
    </v-app-bar>
    <v-main>
      <v-container fluid >
        <v-row>
          <v-col cols="2">
            <v-content style="padding: 0">
              <v-row style="padding: 12px 12px 0 12px">
                <v-col cols="6" style="padding-bottom: 0">
                  <v-text-field label="요청지연" id="delay-input" v-model="delay" hide-details outlined type="number" :min=0
                                :max=6 :rules="delayRules" color="white" :disabled="disableInputAndButton"/>
                </v-col>
                <v-col cols="6" style="padding-bottom: 0">
                  <v-checkbox label="휴대폰번호만 추출" id="mobile-checkbox" @click="filterPhoneNumber" v-model="isMobileOnly"
                              :disabled="disableInputAndButton"/>
                </v-col>
              </v-row>
              <v-row style="padding: 12px;">
                <v-list rounded style="height: 795px; width: 600px" class="overflow-y-auto">
                  <v-subheader>
                    <v-text-field id="keyword-input" v-model="keyword" @keyup.enter="appendKeyword" label="키워드를 입력하세요"
                                  :disabled="disableInputAndButton"></v-text-field>
                    <v-icon id="refresh-icon" color="green" @click="refreshKeywordList"
                            :disabled="disableInputAndButton"> mdi-refresh
                    </v-icon>
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
              </v-row>
            </v-content>
          </v-col>
          <v-col cols="10">
            <v-content id="table-content" style="padding: 0">
              <v-row>
                <v-col cols="3" style="padding: 20px 0px 0px 15px;">
                  <v-text-field id="extract_info" readonly single-line :placeholder="extractInfo" color="white"
                                prepend-icon="mdi-database-arrow-down"></v-text-field>
                </v-col>
                <v-col cols="3"></v-col>
                <v-col cols="6" style="padding: 35px 15px 0px 0px" align="right">
                  <v-progress-circular v-show="isProcessing" indeterminate color="white"
                                       style="padding-right: 60px"></v-progress-circular>
                  <v-btn id="extractButton" @click="getItemList" :disabled="disableInputAndButton" width="115px"> 추출하기
                  </v-btn>
                  <v-btn id="excelDownloadButton" color="green" @click="excelDownload" :disabled="disableInputAndButton"
                         width="115px"> 엑셀저장
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="fill-height">
                <v-col cols="12">
                  <v-data-table :headers="headers" :items="company_list" :items-per-page="10000" fixed-header
                                hide-default-footer height="780px">
                    <template #item.website="{value}">
                      <div class="text-truncate" style="max-width: 300px"> {{ value }}</div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-content>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer app></v-footer>
  </v-app>
</template>
<script> import Login from './components/Login'

export default {
  components: {Login},
  created() {
    this.company_list = []
    this.extractInfo = `${this.company_list.length} 개의 데이터가 추출되었습니다.`
    window.IPC.receive('get-file-path', (evt) => {
      this.exportToExcel(evt)
    })
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }, exportToExcel(path) {
      console.log(this.headers)
      console.log(this.company_list)
      window.IPC.send('write-excel-files', path, this.headers, this.company_list)
    }, filterPhoneNumber() {
      this.company_list = []
      if (this.isMobileOnly) {
        this.total_company_list.map(company => {
          if (company.isMobile) {
            this.company_list.push(company)
          }
        })
      } else {
        this.company_list = this.total_company_list
      }
      this.extractInfo = `${this.company_list.length} 개의 데이터가 추출되었습니다.`
    }, removeFromList(i) {
      this.keywordList.splice(i, 1)
    }, switchDisableStateInputAndButtonComponent() {
      this.disableInputAndButton = !this.disableInputAndButton;
    }, async getItemList() {
      this.company_list = []
      this.total_company_list = []
      let count = 0
      let rank = 0
      this.isProcessing = true
      this.switchDisableStateInputAndButtonComponent()
      for (let keyword of this.keywordList) {
        rank = 0
        for (let page = 1; page <= 6; ++page) {
          await this.sleep(parseInt(this.delay) * 1000);
          await this.$getNAVERMapItemList("https://map.naver.com/v5/api/search?", keyword, page).then(response => {
            if (response.result == null) return;
            response.result.place.list.map(data => {
              rank += 1
              let item = {
                name: data['name'],
                address: data['address'],
                phone: data['tel'],
                category: data['category'],
                keyword: keyword,
                rank: rank,
                website: data['homePage'],
                isMobile: data['tel'].startsWith('010')
              }
              this.total_company_list.push(item);
              if (this.isMobileOnly) {
                if (item.isMobile) {
                  this.company_list.push(item)
                  count += 1
                }
              } else {
                this.company_list.push(item)
                count += 1
              }
              this.extractInfo = `${count} 개의 데이터가 추출되었습니다.`
            })
          })
        }
      }
      this.isProcessing = false
      this.switchDisableStateInputAndButtonComponent()
    }, excelDownload() {
      window.IPC.send('select-dirs')
    }, refreshKeywordList() {
      this.keywordList = []
    }, appendKeyword() {
      this.keywordList.push(this.keyword)
      this.keyword = ""
    }, closeDialog() {
      this.loginDialog = false
    }
  },
  data: () => ({
    page: 6,
    panel: 0,
    keywordList: [],
    keyword: "",
    disableInputAndButton: false,
    delay: 0,
    delayRules: [v => v >= 0],
    isMobileOnly: false,
    isProcessing: false,
    extractInfo: "0개의 데이터가 추출되었습니다.",
    headers: [{text: '업체명', align: 'start', sortable: false, value: 'name', width: '16%'}, {
      text: '주소',
      value: 'address',
      width: '32%'
    }, {text: '전화번호', value: 'phone', width: '12%'}, {text: '업종', value: 'category', width: '12%'}, {
      text: '키워드',
      value: 'keyword',
      width: '10%'
    }, {text: '순위', value: 'rank', width: '8%'}, {text: '웹사이트', value: 'website', width: '300px', fixed: true},],
    company_list: [],
    total_company_list: []
  }),
} </script>
<style lang="scss">
#app {
  background-color: #1f1e2e;
}

#app > div > main > div > div > div > div.layout.row > div.col.col-3 > div > div.v-subheader.theme--light > div > div > div.v-input__slot > div > label {
  color: white;
  font-size: 13px;
}

#app > div > main > div > div > div > div.col.col-2 > main > div > div:nth-child(1) > div:nth-child(2) > div > div > div.v-input__slot > label {
  font-size: 9.5px
}

.v-data-table {
  height: 795px !important;
}

.v-btn-toggle--group > .v-btn.v-btn {
  background-color: #00e676 !important;
}

.v-text-field--outlined fieldset {
  color: rebeccapurple !important;
}

#notification {
  background-color: #272a3d !important;
}

#notification:hover {
  background-color: #8195c7 !important;
}

#loginButton {
  background-color: #272a3d !important;
}

#loginButton:hover {
  background-color: #8195c7 !important;
}

#extractButton {
  background-color: dodgerblue;
  color: white;
  margin-right: 5px;
}

#extractButton[disabled] {
  background-color: #85BDFFFF !important;
  color: white !important;
}

#excelDownloadButton {
  background-color: #4CAF50 !important;
  color: white !important;
}

#excelDownloadButton[disabled] {
  background-color: #85B189FF !important;
  color: white !important;
}

.theme--light.v-label {
  color: white !important;
}

#app > div > main > div > div > div > div.flex > div > div > div > div > label {
  color: white;
}

#extract_info::placeholder {
  color: white;
}

#delay-input {
  color: white;
  background-color: #272a3d;
  border: 10px rebeccapurple;
}

#mobile-checkbox {
  background-color: #00e676;
}

#keyword-input {
  color: white;
}

.v-list {
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
    tr {
      th {
        background-color: #272a3d !important;
        opacity: 0.8;
        color: white !important;
      }
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

.v-icon {
  color: gray !important;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
  color: #cacccb;
  font-weight: bold;
  font-size: 18px;
}

.v-data-table__wrapper {
  margin-bottom: 60px;
}
</style>
