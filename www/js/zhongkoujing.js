/**
 * Created by qiujf on 2015/10/24.
 */

angular.module('starter.controllers')

  .controller('ZhongKouJingCtrl', function ($scope, $stateParams, $ionicPopup, $ionicModal, shareService, historyService) {

    //透照方式Option
    $scope.banZhuangOpt = {
      touZhaoFangShi: [{selected: true, name: "双壁单影", value: "SBDY"}],
      touZhaoDengJi: [{selected: true, name: "A", value: "A"}, {
        selected: false,
        name: "AB",
        value: "AB"
      }, {selected: false, name: "B", value: "B"}]

    };


    $scope.enableSaving = true;
    $scope.operationable = true;
    //初始化
    var historyId = $stateParams.id;
    if (historyId != null) {
      var item = historyService.getItem(historyId);

      $scope.id = item.id;
      $scope.banZhuang = item.banZhuang;
      $scope.baoGuangLiang = item.baoGuangLiang;
      //$scope.enableSaving = false;
      calcYuanQiangDu();
      setFangSheYuanOptions(false);
      calcBaoGuangShiJian();
    } else {
      $scope.id = (new Date()).getTime();
      //板状工艺
      $scope.banZhuang = {
        gongChengHouDu: "",
        waijing: "",
        touZhaoFangShi: "SBDY",
        touZhaoDengJi: "A",
        xiangZhiJi: "",
        touZhaoHouDu: "",
        jiaoPianJuLi: "",
        youXiaoJiaoDianChiCun: "",
        zuiXiaoJiaoJu: "",
        shiJiJiaoJu: "",
        touZhaoCiShu: "",
        k: 1.2,
        yiCiTouZhaoChangDu: 0,
        baoGuangLiang: "",
        fangSheYuanList: [],
        fangSheYuan: "",
        yuanQiangDu: "",
        touZhaoCiShu: "",
        baoGuangShiJian: ""
      };

      //曝光量参数，用于曝光量Modal
      $scope.baoGuangLiang = {
        shiJiJiaoJu: "",
        touZhaoHouDu: "",
        fangSheYuan: "",
        jiaoJuanPinPai: "",
        jiaoJuanXingHao: "",
        jiaoPianXiuZhengXiShuDefault: "",
        jiaoPianXiuZhengXiShu: "",
        baoGuangLiang: ""
      }
    }


    $scope.xiangZhiJi = {
      A: [
        {no: 17, size: 0.080, gchd: 1.2},
        {no: 16, size: 0.100, gchd: 2},
        {no: 15, size: 0.125, gchd: 3.5},
        {no: 14, size: 0.160, gchd: 5.0},
        {no: 13, size: 0.20, gchd: 10},
        {no: 12, size: 0.25, gchd: 15},
        {no: 11, size: 0.32, gchd: 22},
        {no: 10, size: 0.40, gchd: 38},
        {no: 9, size: 0.50, gchd: 48},
        {no: 8, size: 0.63, gchd: 60},
        {no: 7, size: 0.80, gchd: 85},
        {no: 6, size: 1.00, gchd: 125},
        {no: 5, size: 1.25, gchd: 225},
        {no: 4, size: 1.60, gchd: 375},
        {no: 3, size: 2.00, gchd: 99999999}
      ],

      AB: [
        {no: 18, size: 0.063, gchd: 1.2},
        {no: 17, size: 0.080, gchd: 2.0},
        {no: 16, size: 0.100, gchd: 3.5},
        {no: 15, size: 0.125, gchd: 5.0},
        {no: 14, size: 0.160, gchd: 10},
        {no: 13, size: 0.20, gchd: 15},
        {no: 12, size: 0.25, gchd: 22},
        {no: 11, size: 0.32, gchd: 38},
        {no: 10, size: 0.40, gchd: 48},
        {no: 9, size: 0.50, gchd: 60},
        {no: 8, size: 0.63, gchd: 85},
        {no: 7, size: 0.80, gchd: 125},
        {no: 6, size: 1.00, gchd: 225},
        {no: 5, size: 1.25, gchd: 375},
        {no: 4, size: 1.60, gchd: 99999999}
      ],

      B: [
        {no: 19, size: 0.050, gchd: 1.5},
        {no: 18, size: 0.063, gchd: 2.5},
        {no: 17, size: 0.080, gchd: 4.0},
        {no: 16, size: 0.100, gchd: 6.0},
        {no: 15, size: 0.125, gchd: 12},
        {no: 14, size: 0.160, gchd: 18},
        {no: 13, size: 0.20, gchd: 30},
        {no: 12, size: 0.25, gchd: 45},
        {no: 11, size: 0.32, gchd: 55},
        {no: 10, size: 0.40, gchd: 70},
        {no: 9, size: 0.50, gchd: 100},
        {no: 8, size: 0.63, gchd: 180},
        {no: 7, size: 0.80, gchd: 300},
        {no: 6, size: 1.00, gchd: 9999999}
      ]
    };

    $scope.inputWaiJingColor = 'black';

    /**
     * Internal functions
     */

    function getXiangZhiJi(list, dengji, gchd) {
      var temp;
      if (dengji == "A") {
        temp = list.A;
      } else if (dengji == "AB") {
        temp = list.AB;
      } else if (dengji == "B") {
        temp = list.B;
      }
      var i;
      for (i = 0; i < temp.length; i++) {
        if (gchd <= temp[i].gchd) {
          break;
        }
      }
      return temp[i];
    }

    function calcXiangZhiJi() {
      var xiangZhiJi = getXiangZhiJi($scope.xiangZhiJi, $scope.banZhuang.touZhaoDengJi, $scope.banZhuang.touZhaoHouDu);
      $scope.banZhuang.xiangZhiJi = "胶片侧：" + xiangZhiJi.no + "(" + xiangZhiJi.size + ")";
    }

    function calcBaoGuangLiang() {
      var fangSheYuanType = $scope.banZhuang.fangSheYuanList[$scope.banZhuang.fangSheYuan];
      if (fangSheYuanType.type == "Se75") {
        $scope.baoGuangLiang.baoGuangLiang = 0.000083337 * $scope.baoGuangLiang.jiaoPianXiuZhengXiShu *
          Math.pow($scope.banZhuang.shiJiJiaoJu, 2) * Math.pow(2, $scope.banZhuang.touZhaoHouDu / 10);
      } else if (fangSheYuanType.type == "Ir192") {
        $scope.baoGuangLiang.baoGuangLiang = 0.0000738 * $scope.baoGuangLiang.jiaoPianXiuZhengXiShu *
          Math.pow($scope.banZhuang.shiJiJiaoJu, 2) * Math.pow(1.77, $scope.banZhuang.touZhaoHouDu / 10);
      } else if (fangSheYuanType.type == "Co60") {
        $scope.baoGuangLiang.baoGuangLiang = 0.5*Math.pow(Math.E,$scope.baoGuangLiang.touZhaoHouDu/20) * $scope.baoGuangLiang.jiaoPianXiuZhengXiShu *
        Math.pow($scope.banZhuang.shiJiJiaoJu/1000, 2) *160;
      }
      $scope.banZhuang.baoGuangLiang = $scope.baoGuangLiang.baoGuangLiang;


      $scope.banZhuang.baoGuangLiang = Math.round($scope.banZhuang.baoGuangLiang * 10000) / 10000;
      $scope.banZhuang.baoGuangliang_tbq = Math.round($scope.banZhuang.baoGuangLiang * 10000 * 0.037) / 10000;
    }

    function calcZuiXiaoJiaoJu() {
      if ($scope.banZhuang.touZhaoDengJi == "A") {
        $scope.banZhuang.zuiXiaoJiaoJu = $scope.banZhuang.jiaoPianJuLi + 7.5 * $scope.banZhuang.youXiaoJiaoDianChiCun * Math.pow($scope.banZhuang.jiaoPianJuLi, 2 / 3);
      } else if ($scope.banZhuang.touZhaoDengJi == "AB") {
        $scope.banZhuang.zuiXiaoJiaoJu = $scope.banZhuang.jiaoPianJuLi + 10 * $scope.banZhuang.youXiaoJiaoDianChiCun * Math.pow($scope.banZhuang.jiaoPianJuLi, 2 / 3);

      } else if ($scope.banZhuang.touZhaoDengJi == "B") {
        $scope.banZhuang.zuiXiaoJiaoJu = $scope.banZhuang.jiaoPianJuLi + 15 * $scope.banZhuang.youXiaoJiaoDianChiCun * Math.pow($scope.banZhuang.jiaoPianJuLi, 2 / 3);
      }

      $scope.banZhuang.zuiXiaoJiaoJu = Math.round($scope.banZhuang.zuiXiaoJiaoJu * 100) / 100;
    }

    function calcValueOfK() {

      if ($scope.banZhuang.waijing <= 400) {
        if ($scope.banZhuang.touZhaoDengJi == "A") {
          $scope.banZhuang.k = 1.2;
        } else if ($scope.banZhuang.touZhaoDengJi == "AB") {
          $scope.banZhuang.k = 1.2;

        } else if ($scope.banZhuang.touZhaoDengJi == "B") {
          $scope.banZhuang.k = 1.06;
        }
      }
      else {
        if ($scope.banZhuang.touZhaoDengJi == "A") {
          $scope.banZhuang.k = 1.1;
        } else if ($scope.banZhuang.touZhaoDengJi == "AB") {
          $scope.banZhuang.k = 1.1;

        } else if ($scope.banZhuang.touZhaoDengJi == "B") {
          $scope.banZhuang.k = 1.06;
        }
      }

    }

    function calcTouZhaoCiShu() {
      var zuiDaShiZhenJiao = 180 / 3.1415926 * Math.acos((1 + 0.21 * $scope.banZhuang.gongChengHouDu / $scope.banZhuang.waijing) / $scope.banZhuang.k);
      var youXiaoBanFuSheJiao = 180 / 3.1415926 * Math.asin($scope.banZhuang.waijing / (2 * $scope.banZhuang.shiJiJiaoJu - $scope.banZhuang.waijing)) * Math.sin(zuiDaShiZhenJiao * 3.1415926 / 180);
      $scope.banZhuang.touZhaoCiShu = Math.ceil(180 / (zuiDaShiZhenJiao + youXiaoBanFuSheJiao));
    }

    function calcYiCiTouZhaoChangDu() {
      $scope.banZhuang.yiCiTouZhaoChangDu = Math.round((3.1415926 * $scope.banZhuang.waijing / $scope.banZhuang.touZhaoCiShu) * 100) / 100;
    }

    function calcTouZhaoHouDu() {
      $scope.banZhuang.touZhaoHouDu = $scope.banZhuang.gongChengHouDu * 2;
    }

    function calcJiaoPianJuLi() {
      $scope.banZhuang.jiaoPianJuLi = $scope.banZhuang.gongChengHouDu + 2;
    }

    function setFangSheYuanOptions(restDataFlag) {
      var sheXian = [];
      if ($scope.banZhuang.touZhaoDengJi == "A" || $scope.banZhuang.touZhaoDengJi == "AB") {
        if ($scope.banZhuang.touZhaoHouDu >= 10 && $scope.banZhuang.touZhaoHouDu <= 40) {
          sheXian.splice(0, 0, "Se75");
        }

        if ($scope.banZhuang.touZhaoHouDu >= 20 && $scope.banZhuang.touZhaoHouDu <= 100) {
          sheXian.splice(0, 0, "Ir192");
        }

        if ($scope.banZhuang.touZhaoHouDu >= 40 && $scope.banZhuang.touZhaoHouDu <= 200) {
          sheXian.splice(0, 0, "Co60");
        }

      }

      if ($scope.banZhuang.touZhaoDengJi == "B") {
        if ($scope.banZhuang.touZhaoHouDu >= 14 && $scope.banZhuang.touZhaoHouDu <= 40) {
          sheXian.splice(0, 0, "Se75");
        }

        if ($scope.banZhuang.touZhaoHouDu >= 20 && $scope.banZhuang.touZhaoHouDu <= 90) {
          sheXian.splice(0, 0, "Ir192");
        }

        if ($scope.banZhuang.touZhaoHouDu >= 60 && $scope.banZhuang.touZhaoHouDu <= 150) {
          sheXian.splice(0, 0, "Co60");
        }
      }


      var fangSheYuan = shareService.getFangSheYuan();
      $scope.banZhuang.fangSheYuanList = [];
      for (var i = 0; i < fangSheYuan.length; i++) {
        for (var j = 0; j < sheXian.length; j++) {
          if (sheXian[j] == fangSheYuan[i].type) {
            $scope.banZhuang.fangSheYuanList.splice($scope.banZhuang.fangSheYuanList.length, 0, fangSheYuan[i]);
          }
        }
      }


      if(restDataFlag) {

        $scope.banZhuang.fangSheYuan = -1;
        $scope.banZhuang.yuanQiangDu = 0;
        $scope.banZhuang.baoGuangShiJian = 0;
      }
    }

    function calcYuanQiangDu() {
      var fangSheYuan = $scope.banZhuang.fangSheYuanList[$scope.banZhuang.fangSheYuan];
      var dateLiteral = fangSheYuan.date;
      var date = new Date();
      date.setFullYear(Number(dateLiteral.substr(0, 4)));
      date.setMonth(Number(dateLiteral.substr(4, 2)) - 1);
      date.setDate(Number(dateLiteral.substr(6, 2)));
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      var today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);

      var days = (today.getTime() - date.getTime()) / 86400000;
      var curPower = 0;
      if (fangSheYuan.type == "Se75") {
        curPower = fangSheYuan.power * Math.pow(0.5, days / 120);
      } else if (fangSheYuan.type == "Ir192") {
        curPower = fangSheYuan.power * Math.pow(0.5, days / 74);
      } else if (fangSheYuan.type == "Co60") {
        curPower = fangSheYuan.power * Math.pow(0.5, days / 1935);
      }

      $scope.banZhuang.yuanQiangDu = Math.round(curPower * 10000) / 10000;
    }

    function calcBaoGuangShiJian() {
      $scope.banZhuang.baoGuangShiJian = Math.round(($scope.banZhuang.baoGuangLiang / $scope.banZhuang.yuanQiangDu) * 100) / 100;
      if ($scope.banZhuang.baoGuangShiJian < 1 && $scope.banZhuang.baoGuangShiJian > 0) {

        var myPopup = $ionicPopup.show({
          template: '<span style="color:red">曝光时间小于一分钟，请增大实际焦距至{{getTuijianJiaoju().toString()}}mm以上</span>',
          title: '<h3><b>警告</b></h3>',
          scope: $scope,
          buttons: [
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function (e) {

              }
            }
          ]
        });
        myPopup.then(function (res) {

        })

      }
    }


    $scope.getTuijianJiaoju = function () {
      var fangSheYuanType = $scope.banZhuang.fangSheYuanList[$scope.banZhuang.fangSheYuan];
      var jiaoJu = 0;
      if (fangSheYuanType.type == "Se75") {
        jiaoJu = Math.ceil(Math.pow($scope.banZhuang.yuanQiangDu / (0.000083337 * $scope.baoGuangLiang.jiaoPianXiuZhengXiShu * Math.pow(2, $scope.banZhuang.touZhaoHouDu / 10)), 0.5));
      } else if (fangSheYuanType.type == "Ir192") {
        jiaoJu = Math.ceil(Math.pow($scope.banZhuang.yuanQiangDu / (0.0000738 * $scope.baoGuangLiang.jiaoPianXiuZhengXiShu * Math.pow(1.77, $scope.banZhuang.touZhaoHouDu / 10)), 0.5));

      }
      return jiaoJu;
    };

    /**
     * UI functions
     */

    $scope.save = function () {
      var item = {};
      item.id = $scope.id;

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!

      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }


      item.date = yyyy + "-" + mm + "-" + dd;
      item.typeShort = "zhongkoujing";
      item.type = "中口径管工件";
      item.banZhuang = $scope.banZhuang;
      item.baoGuangLiang = $scope.baoGuangLiang;
      historyService.save(item);

      var myPopup = $ionicPopup.show({
        template: '',
        title: '<h3><b>保存成功</b></h3>',
        scope: $scope,
        buttons: [
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function (e) {

            }
          }
        ]
      });
      myPopup.then(function (res) {

      })

    };
    $scope.onGongChengHouDuChange = function () {
      calcTouZhaoHouDu();
      calcXiangZhiJi();
      calcJiaoPianJuLi();
      calcValueOfK();
      calcZuiXiaoJiaoJu();
      if ($scope.banZhuang.shiJiJiaoJu < $scope.banZhuang.zuiXiaoJiaoJu) {
        $scope.banZhuang.shiJiJiaoJu = $scope.banZhuang.zuiXiaoJiaoJu;
      }
      calcTouZhaoCiShu();
      calcYiCiTouZhaoChangDu();
      setFangSheYuanOptions(true);
      calcBaoGuangLiang();
      calcBaoGuangShiJian();
    };

    $scope.onTouZhaoDengjiChange = function () {
      calcXiangZhiJi();
      calcValueOfK();
      calcZuiXiaoJiaoJu();
      if ($scope.banZhuang.shiJiJiaoJu < $scope.banZhuang.zuiXiaoJiaoJu) {
        $scope.banZhuang.shiJiJiaoJu = $scope.banZhuang.zuiXiaoJiaoJu;
      }
      calcTouZhaoCiShu();
      calcYiCiTouZhaoChangDu();
      setFangSheYuanOptions(true);
      calcBaoGuangLiang();
      calcBaoGuangShiJian();
    };

    $scope.onYouXiaoJiaoDianChiCun = function () {
      calcZuiXiaoJiaoJu();
      if ($scope.banZhuang.shiJiJiaoJu < $scope.banZhuang.zuiXiaoJiaoJu) {
        $scope.banZhuang.shiJiJiaoJu = $scope.banZhuang.zuiXiaoJiaoJu;
      }
      calcTouZhaoCiShu();
      calcYiCiTouZhaoChangDu();
      setFangSheYuanOptions(true);
      calcBaoGuangLiang();
      calcBaoGuangShiJian();
    };

    $scope.onShiJiJiaoJuChange = function () {

      if ($scope.banZhuang.shiJiJiaoJu < $scope.banZhuang.zuiXiaoJiaoJu) {
        var myPopup = $ionicPopup.show({
          template: '<span style="color:red">实际焦距不能小于最小焦距</span>',
          title: '<h3><b>警告</b></h3>',
          scope: $scope,
          buttons: [
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function (e) {

              }
            }
          ]
        });
        myPopup.then(function (res) {

        });
        $scope.banZhuang.shiJiJiaoJu = $scope.banZhuang.zuiXiaoJiaoJu;
      }
      calcTouZhaoCiShu();
      calcYiCiTouZhaoChangDu();
      calcBaoGuangLiang();
      calcBaoGuangShiJian();
    };


    $scope.onFangSheYuanChange = function () {
      calcBaoGuangLiang();
      calcYuanQiangDu();
      calcBaoGuangShiJian();
    };


    $scope.onBaoGuangLiangChange = function () {
      calcBaoGuangShiJian();
    };

    $scope.onYuanQiangDuChange = function () {
      calcBaoGuangShiJian();
    };

    $ionicModal.fromTemplateUrl('templates/baoguangliang.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {

      $scope.baoGuangLiang.shiJiJiaoJu = $scope.banZhuang.shiJiJiaoJu;
      $scope.baoGuangLiang.touZhaoHouDu = $scope.banZhuang.touZhaoHouDu;
      $scope.baoGuangLiang.fangSheYuanType = $scope.banZhuang.fangSheYuanList[$scope.banZhuang.fangSheYuan].type;


      $scope.modal.show();
    };
    $scope.closeModal = function () {

      $scope.modal.hide();
    };
    $scope.saveAndCloseModal = function () {

      $scope.banZhuang.baoGuangLiang = $scope.baoGuangLiang.baoGuangLiang;
      $scope.banZhuang.baoGuangliang_tbq = $scope.baoGuangLiang.baoGuangliang_tbq;
      $scope.modal.hide();
      $scope.onBaoGuangLiangChange();
    };
//Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
// Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
// Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

    $scope.onWaiJingChange = function () {
      if ($scope.banZhuang.waijing < 100 || $scope.banZhuang.waijing == undefined) {

        $scope.inputWaiJingColor = 'red';
        var myPopup = $ionicPopup.show({
          template: '<span style="color:red">外径不能小于100毫米</span>',
          title: '<h3><b>警告</b></h3>',
          scope: $scope,
          buttons: [
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function (e) {

              }
            }
          ]
        });
        $scope.operationable = true;
      } else {


        $scope.inputWaiJingColor = 'black';
        $scope.operationable = true;
      }


      calcTouZhaoCiShu();
      calcJiaoPianJuLi();
      calcValueOfK();
      calcZuiXiaoJiaoJu();
      if ($scope.banZhuang.shiJiJiaoJu < $scope.banZhuang.zuiXiaoJiaoJu) {
        $scope.banZhuang.shiJiJiaoJu = $scope.banZhuang.zuiXiaoJiaoJu;
      }
      calcYiCiTouZhaoChangDu();
      setFangSheYuanOptions(true);
      calcBaoGuangLiang();
      calcBaoGuangShiJian();
    };

    $scope.onHanFengChange = function () {
      calcTouZhaoFangShi_Sub();
      calcTouZhaoCiShu();
      calcJiaoPianJuLi();
      calcValueOfK();
      calcZuiXiaoJiaoJu();
      if ($scope.banZhuang.shiJiJiaoJu < $scope.banZhuang.zuiXiaoJiaoJu) {
        $scope.banZhuang.shiJiJiaoJu = $scope.banZhuang.zuiXiaoJiaoJu;
      }
      calcYiCiTouZhaoChangDu();
      setFangSheYuanOptions(true);
      calcBaoGuangLiang();
      calcBaoGuangShiJian();
    };
    $scope.setYouXiaoJiaoDianChiCun = function (value) {
      $scope.banZhuang.youXiaoJiaoDianChiCun = value;
      $scope.onYouXiaoJiaoDianChiCun();
    };

    /**
     * 内部测试
     */


    $scope.getBanZhuang = function () {
      /*    alert($scope.banZhuang.gongChengHouDu + "|" + $scope.banZhuang.touZhaoFangShi + "|" + $scope.banZhuang.touZhaoDengJi + "|" + $scope.banZhuang.touZhaoHouDu
       + "|" + $scope.banZhuang.zuiXiaoJiaoJu + "|" + $scope.banZhuang.shiJiJiaoJu + "|" + $scope.banZhuang.yiCiTouZhaoChangDu + "|" + $scope.banZhuang.baoGuangLiang
       + "|" + $scope.banZhuang.yuanQiangDu + "|" + $scope.banZhuang.baoGuangShiJian);*/
      alert(angular.toJson($scope.banZhuang));
    };
    $scope.setBanZhuang = function () {
      $scope.banZhuang.gongChengHouDu = 0;
      $scope.banZhuang.touZhaoFangShi = "DBDY";
      $scope.banZhuang.touZhaoDengJi = "A";
      $scope.banZhuang.touZhaoHouDu = 12;
      $scope.banZhuang.zuiXiaoJiaoJu = 13;
      $scope.banZhuang.shiJiJiaoJu = 14;
      $scope.banZhuang.yiCiTouZhaoChangDu = 15;
      $scope.banZhuang.baoGuangLiang = 16;
      $scope.banZhuang.yuanQiangDu = 17;
      $scope.banZhuang.baoGuangShiJian = 18;

    }

  })
;

