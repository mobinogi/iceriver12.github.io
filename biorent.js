document.addEventListener('DOMContentLoaded', function () {
    let biorentAlarmActive = false;
    let biorentAlarmInterval;
    let nextAlarmTime;

    function saveAlarmSettings(period, hours, minutes) {
        const settings = { period, hours, minutes };
        localStorage.setItem('biorentSettings', JSON.stringify(settings));
    }

    function loadAlarmSettings() {
        const savedSettings = localStorage.getItem('biorentSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('biorent-period').value = settings.period;
            document.getElementById('biorent-hours').value = settings.hours;
            document.getElementById('biorent-minutes').value = settings.minutes;
        }
    }

    document.getElementById('set-biorent-alarm').addEventListener('click', function () {
        biorentAlarmActive = !biorentAlarmActive;

        const period = document.getElementById('biorent-period').value;
        let hours = parseInt(document.getElementById('biorent-hours').value);
        const minutes = parseInt(document.getElementById('biorent-minutes').value);

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
            document.getElementById('biorent-alarm-time').innerHTML =
                `<span style="color: gray;">다음 알람 시간: <span style="color: red;">${nextAlarmTime.toLocaleTimeString()}</span>`;
        };

        updateAlarmDisplay();

        if (biorentAlarmInterval) clearInterval(biorentAlarmInterval);

        biorentAlarmInterval = setInterval(() => {
            now = new Date();

            if (now.toLocaleTimeString() === nextAlarmTime.toLocaleTimeString()) {
                console.log('비오렌트 알람이 울렸습니다');
                document.getElementById('biorent-alarm-sound').play();

                // 알람이 울리면 다음 4시간 후로 갱신
                nextAlarmTime.setTime(nextAlarmTime.getTime() + 4 * 60 * 60 * 1000);
                updateAlarmDisplay();
            }
        }, 1000);
    });

    loadAlarmSettings();
});

