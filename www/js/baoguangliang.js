/**
 * Created by qiujf on 2015/10/24.
 */
angular.module('starter.controllers')
  .controller('BaoguangCtrl', function ($scope) {
    /*
     $scope.baoGuang = {
     shiJiJiaoJu: 0,
     touZhaoHouDu: 0,
     fangSheYuan: "",
     jiaoPianPinPai: "",
     jiaoPianXingHao: "",
     jiapPianXiuZhengXiShu: 0,
     baoGuangLiang: 0

     }*/


    $scope.baoGuangOpt = {
      jiaoPian: [
        {selected: true, name: "富士", value: "FS"},
        {selected: true, name: "柯达", value: "KD"},
        {selected: true, name: "AGFA", value: "AGFA"}
      ],
      fangSheYuan: [
        {selected: true, name: "Se75", value: "Se75"},
        {selected: true, name: "Ir192", value: "Ir192"}

      ],

      jiaoPianXingHao: {
        selected: null,
        FS: [
          {selected: true, name: "富士80", value: "FS80", xzxs: 4.0},
          {selected: true, name: "富士100", value: "FS100", xzxs: 2.0}
        ],
        KD: [
          {selected: true, name: "MX125", value: "MX125", xzxs: 4.0},
          {selected: true, name: "T200", value: "T200", xzxs: 2.5},
          {selected: true, name: "AA400", value: "AA400", xzxs: 2.0}
        ],
        AGFA: [

          {selected: true, name: "AGFA C4", value: "AGFA C4", xzxs: 4.0},
          {selected: true, name: "AGFA D4", value: "AGFA D4", xzxs: 4.0},
          {selected: true, name: "AGFA D5", value: "AGFA D5", xzxs: 2.5},
          {selected: true, name: "AGFA C7", value: "AGFA C7", xzxs: 2.0},
          {selected: true, name: "AGFA D7", value: "AGFA D7", xzxs: 2.0}
        ]
      }
      ,

    }

    //Business Logics

    function calcBaoGuangLiang() {
      if ($scope.baoGuangLiang.fangSheYuan == "Se75") {
        $scope.baoGuangLiang.baoGuangLiang = 0.000083337 * $scope.baoGuangLiang.jiaoPianXiuZhengXiShu *
          Math.pow($scope.banZhuang.shiJiJiaoJu, 2) * Math.pow(2, $scope.banZhuang.touZhaoHouDu / 10);
      } else if ($scope.baoGuangLiang.fangSheYuan == "Ir192") {
        $scope.baoGuangLiang.baoGuangLiang = 0.000099 * $scope.baoGuangLiang.jiaoPianXiuZhengXiShu *
          Math.pow($scope.banZhuang.shiJiJiaoJu, 2) * Math.pow(1.2364, $scope.banZhuang.touZhaoHouDu / 5);
      }
    }

    //UI Activities

    $scope.saveBaoGuangLiang = function () {
      $scope.banZhuang.baoGuangLiang = $scope.baoGuangLiang.baoGuangLiang;

    }

    $scope.onJiaoPianXingHaoChange = function (){
      $scope.baoGuangLiang.jiaoPianXiuZhengXiShu = Number( $scope.baoGuangLiang.jiaoPianXiuZhengXiShuDefault);
      calcBaoGuangLiang();
    }

    $scope.onJiaoPianXiuZhengXiShuChange= function(){
      calcBaoGuangLiang();
    }

    $scope.onChangeJiaoPianPinPai = function () {
      if ($scope.baoGuangLiang.jiaoJuanPinPai == "FS") {
        $scope.baoGuangOpt.jiaoPianXingHao.selected = $scope.baoGuangOpt.jiaoPianXingHao.FS;
      } else if ($scope.baoGuangLiang.jiaoJuanPinPai == "KD") {
        $scope.baoGuangOpt.jiaoPianXingHao.selected = $scope.baoGuangOpt.jiaoPianXingHao.KD;
      } else if ($scope.baoGuangLiang.jiaoJuanPinPai == "AGFA") {
        $scope.baoGuangOpt.jiaoPianXingHao.selected = $scope.baoGuangOpt.jiaoPianXingHao.AGFA;
      }
    }

    $scope.onChangeSource = function () {
      calcBaoGuangLiang();
    };

  })
