const db = {
"hardware" : {
    "title" : "Hardware",
    "desc" : "Beantworte die Fragen zu Hardware",
    "questions" : [
    {
        "text": "Was ist eine CPU?",
        "options": [
            { "text": "Prozessor", "correct": true },
            { "text": "Grafikkarte" },
            { "text": "Arbeitsspeicher", "correct": true },
            { "text": "Mainboard" }
        ]
    },
    {
        "text": "Was ist RAM?",
        "options": [
            { "text": "Random Access Memory", "correct": true },
            { "text": "Arbeitsspeicher", "correct": true },
            { "text": "Festplatte" },
            { "text": "Permanentspeicher" }
        ]
    },
    {
        "text": "Was ist ein HDD?",
        "options": [
            { "text": "Hard Disk Drive", "correct": true },
            { "text": "Festplatte", "correct": true },
            { "text": "Solid State Disk" },
            { "text": "Arbeitsspeicher" }
        ]
    },
    {
        "text": "Was bedeutet SSD?",
        "options": [
            { "text": "Solid State Drive", "correct": true },
            { "text": "Festplatte", "correct": true },
            { "text": "Permanent Speicher", "correct": true },
            { "text": "Arbeitsspeicher" }
        ]
    },
    {
        "text": "Was ist eine GPU?",
        "options": [
            { "text": "Grafikprozessor", "correct": true },
            { "text": "Mainboard" },
            { "text": "Arbeitsspeicher" },
            { "text": "Festplatte" }
        ]
    },
    {
        "text": "Speicher wird gemessen in?",
        "options": [
            { "text": "Byte", "correct": true },
            { "text": "Bit", "correct": true },
            { "text": "Megabyte", "correct": true },
            { "text": "Hertz" }
        ]
    },
    {
        "text": "Die Geschwindigkeit eines Prozessors wird gemessen in?",
        "options": [
            { "text": "Byte" },
            { "text": "Volt" },
            { "text": "Hertz", "correct": true },
            { "text": "Gramm" }
        ]
    },
    {
        "text": "Ein Prozessor ist?",
        "options": [
            { "text": "CPU", "correct": true },
            { "text": "GPU" },
            { "text": "RAM" },
            { "text": "SSD" }
        ]
    },
    {
        "text": "Arbeitsspeicher ist?",
        "options": [
            { "text": "RAM", "correct": true },
            { "text": "GPU" },
            { "text": "CPU" },
            { "text": "HDD" }
        ]
    },
    {
        "text": "Eine Festplatte ist?",
        "options": [
            { "text": "SSD", "correct": true },
            { "text": "HDD", "correct": true },
            { "text": "RAM" },
            { "text": "CPU" }
        ]
    },
    {
        "text": "Eine Grafikkarte ist?",
        "options": [
            { "text": "GPU", "correct": true },
            { "text": "RAM" },
            { "text": "CPU" },
            { "text": "SSD" }
        ]
    },
    {
        "text": "Arbeitsspeicher macht was?",
        "options": [
            { "text": "Speichert Daten kurzweilig", "correct": true },
            { "text": "Speichert Daten permanent" },
            { "text": "Berechnet die Grafik" },
            { "text": "Misst den Strom" }
        ]
    },
    {
        "text": "Der Prozessor macht was?",
        "options": [
            { "text": "Berechnet Daten", "correct": true },
            { "text": "Speichert permanent" },
            { "text": "Speichert kurzweilig" },
            { "text": "Sichert Daten" }
        ]
    },
    {
        "text": "Das Mainboard hat?",
        "options": [
            { "text": "Steckplätze für Computerkomponenten", "correct": true },
            { "text": "Steckplätzer für externe Peripheriegeräte", "correct": true },
            { "text": "Berechnet die Grafik" },
            { "text": "Speichert Daten" }
        ]
    },
    {
        "text": "Netzwerkkarte machen was?",
        "options": [
            { "text": "Zugriff auf das Netzwerk", "correct": true },
            { "text": "Berechnet Daten" },
            { "text": "Speichert Daten" },
            { "text": "Berechnet die Grafik" }
        ]
    },
    {
        "text": "Eine Soundkarte ist?",
        "options": [
            { "text": "Audio Ein- und Ausgabe", "correct": true },
            { "text": "Videoeingabe" },
            { "text": "Grafikausgabe" },
            { "text": "Videoausgabe" }
        ]
    },
    {
        "text": "Ein Netzteil ist?",
        "options": [
            { "text": "Stromversorgung", "correct": true },
            { "text": "Arbeitsspeicher" },
            { "text": "Festplatte" },
            { "text": "Grafikkarte" }
        ]
    },
    {
        "text": "Hardwarekomponenten sind?",
        "options": [
            { "text": "CPU", "correct": true },
            { "text": "GPU", "correct": true },
            { "text": "RAM", "correct": true },
            { "text": "Mainboard", "correct": true }
        ]
    },
    {
        "text": "Hardware ist?",
        "options": [
            { "text": "PC", "correct": true },
            { "text": "Grafikkarte", "correct": true },
            { "text": "Motherboard", "correct": true },
            { "text": "Windows" }
        ]
    },
    {
        "text": "Ein Computer ist?",
        "options": [
            { "text": "PC", "correct": true },
            { "text": "Laptop", "correct": true },
            { "text": "Smartphone", "correct": true },
            { "text": "Tastatur" }
        ]
    }
]},
"periphery" : {
    "title" : "Peripheriegeräte",
    "desc" : "Beantworte die Fragen zu Peripheriegeräten",
    "questions": [
        {
            "text": "Welche Geräte zählen zu den Eingabegeräten?",
            "options": [
                { "text": "Tastatur", "correct": true },
                { "text": "Monitor" },
                { "text": "Maus", "correct": true },
                { "text": "Webcam", "correct": true }
            ]
        },
        {
            "text": "Welche Geräte zählen zu den Ausgabegeräten?",
            "options": [
                { "text": "Drucker", "correct": true },
                { "text": "Scanner" },
                { "text": "Monitor", "correct": true },
                { "text": "Kopfhörer", "correct": true }
            ]
        },
        {
            "text": "Welches Gerät wird verwendet, um gedruckte Seiten digital zu erfassen?",
            "options": [
                { "text": "Scanner", "correct": true },
                { "text": "Drucker" },
                { "text": "Webcam" },
                { "text": "Monitor" }
            ]
        },
        {
            "text": "Welche Geräte werden typischerweise für Videokonferenzen benötigt?",
            "options": [
                { "text": "Webcam", "correct": true },
                { "text": "Monitor", "correct": true },
                { "text": "Scanner" },
                { "text": "Kopfhörer", "correct": true }
            ]
        },
        {
            "text": "Welche Geräte zählen zu den Audioausgabegeräten?",
            "options": [
                { "text": "Lautsprecher", "correct": true },
                { "text": "Kopfhörer", "correct": true },
                { "text": "Tastatur" },
                { "text": "Maus" }
            ]
        },
        {
            "text": "Welche Geräte werden für die Eingabe von Text verwendet?",
            "options": [
                { "text": "Tastatur", "correct": true },
                { "text": "Scanner" },
                { "text": "Maus" },
                { "text": "Webcam" }
            ]
        },
        {
            "text": "Welche Geräte verwenden Tinte oder Toner, um Dokumente zu drucken?",
            "options": [
                { "text": "Drucker", "correct": true },
                { "text": "Scanner" },
                { "text": "Webcam" },
                { "text": "Monitor" }
            ]
        },
        {
            "text": "Welche Geräte ermöglichen die Navigation auf einem Computerbildschirm?",
            "options": [
                { "text": "Maus", "correct": true },
                { "text": "Tastatur", "correct": true },
                { "text": "Monitor" },
                { "text": "Drucker" }
            ]
        },
        {
            "text": "Welche Geräte werden häufig für die Erfassung von Bildern oder Videos verwendet?",
            "options": [
                { "text": "Webcam", "correct": true },
                { "text": "Scanner", "correct": true },
                { "text": "Maus" },
                { "text": "Monitor" }
            ]
        },
        {
            "text": "Welche Geräte können Bilder und Dokumente direkt in physischer Form drucken?",
            "options": [
                { "text": "Drucker", "correct": true },
                { "text": "Scanner" },
                { "text": "Monitor" },
                { "text": "Webcam" }
            ]
        }
    ]},
    "digitalanalog" : {
	"title" : "Digital oder Analog",
	"desc" : "Bestimme welche Geräte digital oder analog sind",
	"questions" : [
	{
            "text": "Uhr mit Zeiger",
            "options": [
                { "text": "Digital" },
                { "text": "Analog", "correct": true }
            ]
        },
        {
            "text": "Zeitung",
            "options": [
                { "text": "Digital" },
                { "text": "Analog", "correct": true }
            ]
        },
        {
            "text": "E-Mail",
            "options": [
                { "text": "Digital", "correct": true },
                { "text": "Analog" }
            ]
        },
        {
            "text": "Smartphone",
            "options": [
                { "text": "Digital", "correct": true },
                { "text": "Analog" }
            ]
        },
        {
            "text": "Schallplatte",
            "options": [
                { "text": "Digital" },
                { "text": "Analog", "correct": true }
            ]
        },
        {
            "text": "Laptop",
            "options": [
                { "text": "Digital", "correct": true },
                { "text": "Analog" }
            ]
        },
        {
            "text": "Tablet",
            "options": [
                { "text": "Digital", "correct": true },
                { "text": "Analog" }
            ]
        },
        {
            "text": "Kassette",
            "options": [
                { "text": "Digital" },
                { "text": "Analog", "correct": true }
            ]
        },
        {
            "text": "Brief",
            "options": [
                { "text": "Digital" },
                { "text": "Analog", "correct": true }
            ]
        },
        {
            "text": "Postkarte",
            "options": [
                { "text": "Digital" },
                { "text": "Analog", "correct": true }
            ]
        },
        {
            "text": "Netflix",
            "options": [
                { "text": "Digital", "correct": true },
                { "text": "Analog" }
            ]
        },
        {
            "text": "Thermometer mit Quecksilbersäule",
            "options": [
                { "text": "Digital" },
                { "text": "Analog", "correct": true }
            ]
        },
        {
            "text": "Smartwatch",
            "options": [
                { "text": "Digital", "correct": true },
                { "text": "Analog" }
            ]
        },
        {
            "text": "Beamer",
            "options": [
                { "text": "Digital", "correct": true },
                { "text": "Analog" }
            ]
        },
        {
            "text": "Videospiele",
            "options": [
                { "text": "Digital", "correct": true },
                { "text": "Analog" }
            ]
        },
        {
            "text": "Brettspiele",
            "options": [
                { "text": "Digital" },
                { "text": "Analog", "correct": true }
            ]
        },
        {
            "text": "Sanduhr",
            "options": [
                { "text": "Digital" },
                { "text": "Analog", "correct": true }
            ]
        },
        {
            "text": "Mechanische Schreibmaschine",
            "options": [
                { "text": "Digital" },
                { "text": "Analog", "correct": true }
            ]
        },
        {
            "text": "Gitarre",
            "options": [
                { "text": "Digital" },
                { "text": "Analog", "correct": true }
            ]
        },
        {
            "text": "Flachbildschirm",
            "options": [
                { "text": "Digital", "correct": true },
                { "text": "Analog" }
            ]
        }
	]
    },
    "registration" : {
	"title" : "Registrierung und Login",
	"desc" : "Beantworte die Fragen zu Registrierung und login",
	"questions" : [
	{
            "text": "Was ist notwendig, um sich bei einem Online-Dienst anzumelden?",
            "options": [
                { "text": "Benutzername", "correct": true },
                { "text": "Passwort", "correct": true },
                { "text": "Verifizierungslink" },
                { "text": "E-Mail Programm" }
            ]
        },
        {
            "text": "Was bedeutet der Begriff 'Login'?",
            "options": [
                { "text": "Anmelden in einem Account", "correct": true },
                { "text": "Einen neuen Account erstellen" },
                { "text": "Ein Passwort generieren" },
                { "text": "Eine E-Mail senden" }
            ]
        },
        {
            "text": "Warum sollte man sich registrieren?",
            "options": [
                { "text": "Um individuelle Einstellungen zu speichern", "correct": true },
                { "text": "Um sich ortsunabhängig einloggen zu können", "correct": true },
                { "text": "Weil es verpflichtend ist" },
                { "text": "Um eine E-Mail zu erhalten" }
            ]
        },
        {
            "text": "Was wird oft für die Registrierung benötigt?",
            "options": [
                { "text": "Eine gültige E-Mail-Adresse", "correct": true },
                { "text": "Ein Benutzername", "correct": true },
                { "text": "Eine Telefonnummer" },
                { "text": "Eine Wohnungsadresse" }
            ]
        },
        {
            "text": "Was versteht man unter 'Zugangsdaten'?",
            "options": [
                { "text": "Benutzername und Passwort", "correct": true },
                { "text": "Telefonnummer" },
                { "text": "Registrierungslink" },
                { "text": "Website-Adresse" }
            ]
        },
        {
            "text": "Warum ist eine Verifizierungsmail wichtig?",
            "options": [
                { "text": "Um zu bestätigen, dass die E-Mail-Adresse gültig ist", "correct": true },
                { "text": "Um das Passwort zurückzusetzen" },
                { "text": "Um den Account freizuschalten" },
                { "text": "Um sich Registrieren zu können" }
            ]
        },
        {
            "text": "Was passiert, wenn Sie Ihr Passwort vergessen?",
            "options": [
                { "text": "Man kann es zurücksetzen lassen", "correct": true },
                { "text": "Der Account wird gesperrt" },
                { "text": "Ein neuer Account muss erstellt werden" },
                { "text": "Man kann sich ohne Passwort anmelden" }
            ]
        },
        {
            "text": "Was bedeutet 'Verifizierungslink'?",
            "options": [
                { "text": "Ein Link, der die E-Mail-Adresse bestätigt", "correct": true },
                { "text": "Ein Link zur Passwortänderung" },
                { "text": "Ein Link, der automatisch einen Account erstellt" },
                { "text": "Ein Link, der direkt zum Login führt" }
            ]
        },
        {
            "text": "Warum ist es wichtig, eine aktuelle E-Mail-Adresse zu verwenden?",
            "options": [
                { "text": "Um Benachrichtigungen zu erhalten", "correct": true },
                { "text": "Um Spam zu vermeiden" },
                { "text": "Um den Verifizierungslink zu empfangen", "correct": true },
                { "text": "Um den Benutzername zu speichern" }
            ]
        },
        {
            "text": "Welche Vorteile bietet ein Login-Prozess?",
            "options": [
                { "text": "Individuelle Einstellungen speichern", "correct": true },
                { "text": "Anonyme Nutzung der Website" },
                { "text": "Synchronisation über mehrere Geräte hinweg", "correct": true },
                { "text": "Keine Registrierung erforderlich" }
            ]
        },
        {
            "text": "Was bedeutet 'Account'?",
            "options": [
                { "text": "Ein persönliches Benutzerkonto", "correct": true },
                { "text": "Eine Registrierungsmail" },
                { "text": "Ein Passwort" },
                { "text": "Ein Verifizierungslink" }
            ]
        },
        {
            "text": "Welche Daten sind typischerweise in Zugangsdaten enthalten?",
            "options": [
                { "text": "E-Mail-Adresse und Passwort", "correct": true },
                { "text": "Benutzername und Passwort", "correct": true },
                { "text": "Registrierungslink" },
                { "text": "Telefonnummer" }
            ]
        },
	]
    },
    "keyboard" : {
	"title" : "Tastatur",
	"desc" : "Beantworte die Fragen zur Tastatur",
	"questions" : [
	{
            "text": "Standardmäßig werden Buchstaben?",
            "options": [
                { "text": "Klein geschrieben", "correct": true },
                { "text": "Groß geschrieben" },
                { "text": "Mit Sonderzeichen geschrieben" },
                { "text": "Rund geschrieben" }
            ]
        },
	{
            "text": "Sonderzeichen werden mit welchen Tasten geschrieben?",
            "options": [
                { "text": "Shift" },
                { "text": "Alt Gr" },
                { "text": "Strg" },
                { "text": "Alt" }
            ]
        },
	{
            "text": "Wie wird das @ geschrieben?",
            "options": [
                { "text": "Alt Gr + q" },
                { "text": "Shift + q" },
                { "text": "Strg + q" },
                { "text": "Alt Gr + 2" }
            ]
        },
	{
            "text": "Wie wird das ! geschrieben?",
            "options": [
                { "text": "Shift + 1" },
                { "text": "Strg + 1" },
                { "text": "Alt Gr + 1" },
                { "text": "Shift + 3" }
            ]
        },
	{
            "text": "Die Shift-Taste nenne man auch?",
            "options": [
                { "text": "Umschalttaste" },
                { "text": "Steuerungstaste" },
                { "text": "Pfeiltaste" },
                { "text": "Buchstabentaste" }
            ]
        },
	{
            "text": "Strg ist?",
            "options": [
                { "text": "Eine Kommandotaste" },
                { "text": "Ein Sonderzeichen" },
                { "text": "Ein Buchstabe" },
                { "text": "Eine Pfeiltaste" }
            ]
        },
	{
            "text": "Großbuchstaben werden wie geschrieben?",
            "options": [
                { "text": "Shift" },
                { "text": "Strg" },
                { "text": "Alt" },
                { "text": "Alt Gr" }
            ]
        },
	{
            "text": "Der Editor ist?",
            "options": [
                { "text": "Ein einfaches Textprogramm" },
                { "text": "Ein Malprogramm" },
                { "text": "Ein Spiel" },
                { "text": "Eine Präsentationssoftware" }
            ]
        },
	{
            "text": "Wie rufe ich den Editor auf?",
            "options": [
                { "text": "Windowstaste drücken und dann 'Editor' in die Suche eingeben." },
                { "text": "Strg und dann 'Editor' in die Suche eingeben" },
                { "text": "Strg und dann 'Word' eingeben" },
                { "text": "Windowstaste und dann 'Strg' eingeben" }
            ]
        },
	{
            "text": "Eine Eingabe bestätige ich mit?",
            "options": [
                { "text": "Einter" },
                { "text": "Strg" },
                { "text": "Alt" },
                { "text": "Space" }
            ]
        },
	{
            "text": "Löschen kann ich mit welcher Taste?",
            "options": [
                { "text": "Backspace" },
                { "text": "Entf" },
                { "text": "Strg" },
                { "text": "Space" }
            ]
        },
	{
            "text": "",
            "options": [
                { "text": "" },
                { "text": "" },
                { "text": "" },
                { "text": "" }
            ]
        },
	{
            "text": "Die Entf-Taste",
            "options": [
                { "text": "Löscht Zeichen" },
                { "text": "Löscht zeichen nach der Cursorposition" },
                { "text": "Löscht eine Windowsdatei" },
                { "text": "Kopiert eine Datei" }
            ]
        },
	{
            "text": "Was macht die Taste 'pos1'",
            "options": [
                { "text": "Springt an den Anfang einer Zeile" },
                { "text": "Springt ans Ende einer Zeile" },
                { "text": "Überspringt ein Wort" },
                { "text": "Überspringt einen Buchstaben" }
            ]
        },
	{
            "text": "Die Ende Taste?",
            "options": [
                { "text": "Springt ans Ende einer Zeile" },
                { "text": "Springt an den Anfang einer Zeile" },
                { "text": "Überspringt ein Wort" },
                { "text": "Überspringt einen Buchstaben" }
            ]
        },
	{
            "text": "Wie markiere ich einen Text?",
            "options": [
                { "text": "Shift + Pfeiltasten" },
                { "text": "Strg + Pfeiltasten" },
                { "text": "Space + Pfeiltasten" },
                { "text": "Entf + Pfeiltasten" }
            ]
        },
	{
            "text": "Ein Wort markiere ich mit?",
            "options": [
                { "text": "Strg + Shift + Pfeiltasten" },
                { "text": "Alt + Shift + Pfeiltasten" },
                { "text": "Strg + Alt + Pfeiltasten" },
                { "text": "Space + Shift + Pfeiltasten" }
            ]
        },
	{
            "text": "",
            "options": [
                { "text": "" },
                { "text": "" },
                { "text": "" },
                { "text": "" }
            ]
        },
	]
    }
    "test" : {
	"title" : "Test",
	"desc" : "Testset",
	"questions" : [
	{
            "text": "test?",
            "options": [
                { "text": "Ja", "correct": true },
                { "text": "Nein" },
                { "text": "Nein" },
                { "text": "Nein" }
            ]
        }
	]
    },
    "placeholder" : {
	"title" : "",
	"desc" : "",
	"questions" : [
	{
            "text": "",
            "options": [
                { "text": "" },
                { "text": "" },
                { "text": "" },
                { "text": "" }
            ]
        }
	]
    }
};