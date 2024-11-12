document.addEventListener('DOMContentLoaded', function () {
    const alarmButton = document.getElementById('toggle-world-boss-alarm');
    const alarmStatus = document.getElementById('world-boss-alarm-status');
    const alarmSound = document.getElementById('world-boss-alarm-sound');
    
    let alarmEnabled = false;
    let worldBossAlarmInterval;

    // 알람을 울릴 시간 설정 (오전 11:55와 오후 7:55)
    const alarmTimes = [
        { hours: 11, minutes: 55, period: 'AM' },
        { hours: 7, minutes: 55, period: 'PM' }
    ];

    // 알람 설정/해제 버튼 클릭 시 동작
    alarmButton.addEventListener('click', function () {
        alarmEnabled = !alarmEnabled;
        if (alarmEnabled) {
            alarmStatus.textContent = "알람 활성화됨";
            startWorldBossAlarm();
        } else {
            alarmStatus.textContent = "알람 비활성화";
            stopWorldBossAlarm();
        }
    });

    // 월드 보스 알람을 시작하는 함수
    function startWorldBossAlarm() {
        checkAndPlayAlarm(); // 즉시 한 번 체크
        worldBossAlarmInterval = setInterval(checkAndPlayAlarm, 1000); // 매 초마다 체크
    }

    // 월드 보스 알람을 멈추는 함수
    function stopWorldBossAlarm() {
        if (worldBossAlarmInterval) {
            clearInterval(worldBossAlarmInterval);
        }
    }

    // 현재 시간과 알람 시간을 비교하여 알람 재생
    function checkAndPlayAlarm() {
        const now = new Date();
        let currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();

        // 현재 시간을 AM/PM 형식으로 변환
        const currentPeriod = currentHours >= 12 ? 'PM' : 'AM';
        if (currentHours > 12) currentHours -= 12;
        if (currentHours === 0) currentHours = 12;

        // 알람 시간이 일치하면 알람 재생
        alarmTimes.forEach(alarm => {
            if (
                currentHours === alarm.hours &&
                currentMinutes === alarm.minutes &&
                currentSeconds === 0 && // 초 단위까지 일치하는지 확인
                currentPeriod === alarm.period
            ) {
                console.log('월드 보스 알람이 울립니다!');
                playAlarmSound();
            }
        });
    }

    // 알람 소리를 재생하는 함수
    function playAlarmSound() {
        if (alarmSound) {
            alarmSound.currentTime = 0; // 소리 재생을 처음부터 시작
            alarmSound.play().then(() => {
                console.log('월드 보스 알람 소리 재생 중');
            }).catch((error) => {
                console.error('소리 재생 오류:', error);
            });
        }
    }
});

