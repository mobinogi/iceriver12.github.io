// barrier.js
document.addEventListener('DOMContentLoaded', function () {
  // 결계 알람 트리거 시간 (출현 3분 전)
  const barrierAlarmTriggerTimes = [
    { hour: 2, minute: 57 },
    { hour: 5, minute: 57 },
    { hour: 8, minute: 57 },
    { hour: 11, minute: 57 },
    { hour: 14, minute: 57 },
    { hour: 17, minute: 57 },
    { hour: 20, minute: 57 },
    { hour: 23, minute: 57 }
  ];

  const barrierAlarmSound = document.getElementById('barrier-alarm-sound');
  const mainToggleButton = document.getElementById('barrier-toggle');
  const optionsContainer = document.getElementById('barrier-options');
  // mSwitch 플러그인으로 초기화된 체크박스는 jQuery 객체로 처리
  const soundSwitch = $("#barrier-sound-switch");
  const popupSwitch = $("#barrier-popup-switch");

  let alarmActive = false;
  let intervalId;

  // 커스텀 팝업 함수: 권한 없이 화면 중앙에 팝업 알림을 띄움
  function showCustomPopup(message) {
    var overlay = document.createElement("div");
    overlay.id = "custom-popup-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    var popup = document.createElement("div");
    popup.id = "custom-popup";
    popup.innerHTML = message;
    popup.style.backgroundColor = "#fff";
    popup.style.padding = "20px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
    popup.style.fontSize = "16px";
    popup.style.textAlign = "center";

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    setTimeout(function(){
      if(document.body.contains(overlay)) {
         document.body.removeChild(overlay);
      }
    }, 3000);
  }

  function checkAndTriggerBarrierAlarm() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    // 매분 0초에만 실행 (중복 실행 방지)
    if (currentSecond !== 0) return;

    barrierAlarmTriggerTimes.forEach(function(time) {
      if (currentHour === time.hour && currentMinute === time.minute) {
        console.log(`결계 알람 울림 (3분 전): ${time.hour}:${(time.minute < 10 ? '0' : '') + time.minute}`);
        // 소리와 알람(팝업)이 둘 다 활성화된 경우: 소리는 즉시, 팝업은 0.5초 후 실행
        if (soundSwitch.val() === "1" && barrierAlarmSound) {
          barrierAlarmSound.currentTime = 0;
          barrierAlarmSound.play().catch(function(error) {
            console.error('결계 알람 소리 재생 오류:', error);
          });
        }
        if (popupSwitch.val() === "1") {
          if (soundSwitch.val() === "1") {
            setTimeout(function(){
              showCustomPopup("결계 알람: 지정된 알람 시간입니다.");
            }, 500);
          } else {
            showCustomPopup("결계 알람: 지정된 알람 시간입니다.");
          }
        }
      }
    });
  }

  mainToggleButton.addEventListener('click', function () {
    if (!alarmActive) {
      alarmActive = true;
      mainToggleButton.innerText = "활성화";
      optionsContainer.style.display = "block";
      if (popupSwitch.val() === "1") {
        // 팝업 스위치가 켜진 상태라면, 미리 알림 권한 요청 (필요하면)
        // 하지만 이번 커스텀 팝업은 권한 없이 작동하므로 이 부분은 선택 사항입니다.
      }
      intervalId = setInterval(checkAndTriggerBarrierAlarm, 1000);
    } else {
      alarmActive = false;
      mainToggleButton.innerText = "비활성화";
      optionsContainer.style.display = "none";
      clearInterval(intervalId);
    }
  });

  // 기존 mSwitch 플러그인 초기화 코드 (원본에서 한글 텍스트만 수정)
  $(".m_switch_check:checkbox").mSwitch({
      onRender:function(elem){
          var entity = elem.attr("entity");
          var label = elem.parent().parent().find(".m_settings_label");
          if (elem.val() == 0){
              $.mSwitch.turnOff(elem);
              label.html(entity + " <span class=\"m_red\">끔</span>");
          } else {
              label.html(entity + " <span class=\"m_green\">켬</span>");
              $.mSwitch.turnOn(elem);
          }
      },
      onRendered:function(elem){
          console.log(elem);
      },
      onTurnOn:function(elem){
          var entity = elem.attr("entity");
          var label = elem.parent().parent().find(".m_settings_label");
          elem.val("1");
          label.html(entity + " <span class=\"m_green\">켬</span>");
      },
      onTurnOff:function(elem){
          var entity = elem.attr("entity");
          var label = elem.parent().parent().find(".m_settings_label");
          elem.val("0");
          label.html(entity + " <span class=\"m_red\">끔</span>");
      }
  });
});
