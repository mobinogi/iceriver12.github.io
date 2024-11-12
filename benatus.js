document.addEventListener('DOMContentLoaded', function () {
    let benatusAlarmActive = false;
    let benatusAlarmInterval;
    let nextAlarmTime;

    function saveAlarmSettings(period, hours, minutes) {
        const settings = { period, hours, minutes };
        localStorage.setItem('benatusSettings', JSON.stringify(settings));
    }

    function loadAlarmSettings() {
        const savedSettings = localStorage.getItem('benatusSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('benatus-period').value = settings.period;
            document.getElementById('benatus-hours').value = settings.hours;
            document.getElementById('benatus-minutes').value = settings.minutes;
        }
    }

    document.getElementById('set-benatus-alarm').addEventListener('click', function () {
        benatusAlarmActive = !benatusAlarmActive;

        const period = document.getElementById('benatus-period').value;
        let hours = parseInt(document.getElementById('benatus-hours').value);
        const minutes = parseInt(document.getElementById('benatus-minutes').value);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const selectedTime = new Date();
        selectedTime.setHours(hours);
        selectedTime.setMinutes(minutes);
        selectedTime.setSeconds(0);

        let now = new Date();

        // 설정된 시간이 현재 시간보다 과거인 경우, 자동으로 다음 가능한 알람 시간으로 조정
        while (selectedTime <= now) {
            selectedTime.setTime(selectedTime.getTime() + 4 * 60 * 60 * 1000); // 4시간 후로 건너뜀
        }

        nextAlarmTime = new Date(selectedTime.getTime());

        saveAlarmSettings(period, hours, minutes);

        const updateAlarmDisplay = () => {
            document.getElementById('benatus-alarm-time').innerHTML =
                `<span style="font-family: 'GmarketLight', Arial, sans-serif; color: gray;">다음 알람 시간: <span style="font-family: 'GmarketLight', Arial, sans-serif; color: red;">${nextAlarmTime.toLocaleTimeString()}</span>`;
        };

        updateAlarmDisplay();

        if (benatusAlarmInterval) clearInterval(benatusAlarmInterval);

        benatusAlarmInterval = setInterval(() => {
            now = new Date();

            if (now.toLocaleTimeString() === nextAlarmTime.toLocaleTimeString()) {
                console.log('베나투스 알람이 울렸습니다');
                document.getElementById('benatus-alarm-sound').play();

                // 알람이 울리면 다음 4시간 후로 갱신
                nextAlarmTime.setTime(nextAlarmTime.getTime() + 4 * 60 * 60 * 1000);
                updateAlarmDisplay();
            }
        }, 1000);
    });

    loadAlarmSettings();
});
