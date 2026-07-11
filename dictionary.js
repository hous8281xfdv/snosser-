const fullDictionary = {};
const allWords = [];

async function loadDictionary() {
    const baseWords = {
        "hello":{t:["привет","здравствуйте"],p:"/həˈloʊ/",ex:[{en:"Hello, how are you?",ru:"Привет, как дела?"}]},
        "goodbye":{t:["до свидания","пока"],p:"/ɡʊdˈbaɪ/",ex:[{en:"Goodbye, see you tomorrow.",ru:"До свидания, увидимся завтра."}]},
        "thank you":{t:["спасибо"],p:"/θæŋk juː/",ex:[{en:"Thank you for your help.",ru:"Спасибо за помощь."}]},
        "please":{t:["пожалуйста"],p:"/pliːz/",ex:[{en:"Please sit down.",ru:"Пожалуйста, садитесь."}]},
        "sorry":{t:["извините","простите"],p:"/ˈsɒri/",ex:[{en:"I'm sorry.",ru:"Мне жаль."}]},
        "yes":{t:["да"],p:"/jes/",ex:[{en:"Yes, I agree.",ru:"Да, я согласен."}]},
        "no":{t:["нет"],p:"/noʊ/",ex:[{en:"No, thank you.",ru:"Нет, спасибо."}]},
        "love":{t:["любовь","любить"],p:"/lʌv/",ex:[{en:"I love you.",ru:"Я тебя люблю."}]},
        "friend":{t:["друг"],p:"/frend/",ex:[{en:"She is my friend.",ru:"Она моя подруга."}]},
        "family":{t:["семья"],p:"/ˈfæməli/",ex:[{en:"Family comes first.",ru:"Семья на первом месте."}]},
        "home":{t:["дом"],p:"/hoʊm/",ex:[{en:"I'm going home.",ru:"Я иду домой."}]},
        "work":{t:["работа","работать"],p:"/wɜːrk/",ex:[{en:"I have work.",ru:"У меня работа."}]},
        "school":{t:["школа"],p:"/skuːl/",ex:[{en:"My son goes to school.",ru:"Мой сын ходит в школу."}]},
        "book":{t:["книга"],p:"/bʊk/",ex:[{en:"I'm reading a book.",ru:"Я читаю книгу."}]},
        "water":{t:["вода"],p:"/ˈwɔːtər/",ex:[{en:"Can I have water?",ru:"Можно воды?"}]},
        "food":{t:["еда"],p:"/fuːd/",ex:[{en:"The food is great.",ru:"Еда отличная."}]},
        "time":{t:["время"],p:"/taɪm/",ex:[{en:"What time is it?",ru:"Который час?"}]},
        "day":{t:["день"],p:"/deɪ/",ex:[{en:"Have a nice day!",ru:"Хорошего дня!"}]},
        "night":{t:["ночь"],p:"/naɪt/",ex:[{en:"Good night!",ru:"Спокойной ночи!"}]},
        "today":{t:["сегодня"],p:"/təˈdeɪ/",ex:[{en:"Today is Monday.",ru:"Сегодня понедельник."}]},
        "tomorrow":{t:["завтра"],p:"/təˈmɔːroʊ/",ex:[{en:"See you tomorrow.",ru:"Увидимся завтра."}]},
        "yesterday":{t:["вчера"],p:"/ˈjestərdeɪ/",ex:[{en:"I saw him yesterday.",ru:"Я видел его вчера."}]},
        "beautiful":{t:["красивый"],p:"/ˈbjuːtɪfəl/",ex:[{en:"You look beautiful.",ru:"Ты красиво выглядишь."}]},
        "good":{t:["хороший"],p:"/ɡʊd/",ex:[{en:"Good morning!",ru:"Доброе утро!"}]},
        "bad":{t:["плохой"],p:"/bæd/",ex:[{en:"That's too bad.",ru:"Это очень плохо."}]},
        "big":{t:["большой"],p:"/bɪɡ/",ex:[{en:"It's a big house.",ru:"Это большой дом."}]},
        "small":{t:["маленький"],p:"/smɔːl/",ex:[{en:"The room is small.",ru:"Комната маленькая."}]},
        "new":{t:["новый"],p:"/nuː/",ex:[{en:"I bought a new car.",ru:"Я купил новую машину."}]},
        "old":{t:["старый"],p:"/oʊld/",ex:[{en:"This building is old.",ru:"Это здание старое."}]},
        "happy":{t:["счастливый"],p:"/ˈhæpi/",ex:[{en:"I'm so happy!",ru:"Я так счастлив!"}]},
        "sad":{t:["грустный"],p:"/sæd/",ex:[{en:"Don't be sad.",ru:"Не грусти."}]},
        "angry":{t:["злой"],p:"/ˈæŋɡri/",ex:[{en:"He looks angry.",ru:"Он выглядит злым."}]},
        "hungry":{t:["голодный"],p:"/ˈhʌŋɡri/",ex:[{en:"I'm hungry.",ru:"Я голоден."}]},
        "tired":{t:["уставший"],p:"/ˈtaɪərd/",ex:[{en:"I'm tired.",ru:"Я устал."}]},
        "cold":{t:["холодный"],p:"/koʊld/",ex:[{en:"It's cold outside.",ru:"На улице холодно."}]},
        "hot":{t:["горячий"],p:"/hɒt/",ex:[{en:"The coffee is hot.",ru:"Кофе горячий."}]},
        "fast":{t:["быстрый"],p:"/fæst/",ex:[{en:"He runs fast.",ru:"Он быстро бегает."}]},
        "slow":{t:["медленный"],p:"/sloʊ/",ex:[{en:"The internet is slow.",ru:"Интернет медленный."}]},
        "man":{t:["мужчина"],p:"/mæn/",ex:[{en:"He is a good man.",ru:"Он хороший человек."}]},
        "woman":{t:["женщина"],p:"/ˈwʊmən/",ex:[{en:"She is a strong woman.",ru:"Она сильная женщина."}]},
        "child":{t:["ребёнок"],p:"/tʃaɪld/",ex:[{en:"The child is playing.",ru:"Ребёнок играет."}]},
        "world":{t:["мир"],p:"/wɜːrld/",ex:[{en:"The world is beautiful.",ru:"Мир прекрасен."}]},
        "life":{t:["жизнь"],p:"/laɪf/",ex:[{en:"Life is short.",ru:"Жизнь коротка."}]},
        "money":{t:["деньги"],p:"/ˈmʌni/",ex:[{en:"I need money.",ru:"Мне нужны деньги."}]},
        "city":{t:["город"],p:"/ˈsɪti/",ex:[{en:"New York is a big city.",ru:"Нью-Йорк большой город."}]},
        "country":{t:["страна"],p:"/ˈkʌntri/",ex:[{en:"Russia is a large country.",ru:"Россия большая страна."}]},
        "sun":{t:["солнце"],p:"/sʌn/",ex:[{en:"The sun is shining.",ru:"Солнце светит."}]},
        "moon":{t:["луна"],p:"/muːn/",ex:[{en:"The moon is full.",ru:"Луна полная."}]},
        "star":{t:["звезда"],p:"/stɑːr/",ex:[{en:"The stars are bright.",ru:"Звёзды яркие."}]},
        "tree":{t:["дерево"],p:"/triː/",ex:[{en:"The tree is tall.",ru:"Дерево высокое."}]},
        "flower":{t:["цветок"],p:"/ˈflaʊər/",ex:[{en:"Beautiful flowers.",ru:"Красивые цветы."}]},
        "river":{t:["река"],p:"/ˈrɪvər/",ex:[{en:"The river is wide.",ru:"Река широкая."}]},
        "mountain":{t:["гора"],p:"/ˈmaʊntən/",ex:[{en:"The mountain is high.",ru:"Гора высокая."}]},
        "fire":{t:["огонь"],p:"/ˈfaɪər/",ex:[{en:"The fire is warm.",ru:"Огонь тёплый."}]},
        "earth":{t:["земля"],p:"/ɜːrθ/",ex:[{en:"The earth is round.",ru:"Земля круглая."}]},
        "air":{t:["воздух"],p:"/er/",ex:[{en:"Fresh air.",ru:"Свежий воздух."}]},
        "sky":{t:["небо"],p:"/skaɪ/",ex:[{en:"The sky is blue.",ru:"Небо голубое."}]},
        "hand":{t:["рука"],p:"/hænd/",ex:[{en:"Give me your hand.",ru:"Дай мне руку."}]},
        "eye":{t:["глаз"],p:"/aɪ/",ex:[{en:"She has blue eyes.",ru:"У неё голубые глаза."}]},
        "head":{t:["голова"],p:"/hed/",ex:[{en:"My head hurts.",ru:"У меня болит голова."}]},
        "heart":{t:["сердце"],p:"/hɑːrt/",ex:[{en:"My heart beats.",ru:"Моё сердце бьётся."}]},
        "phone":{t:["телефон"],p:"/foʊn/",ex:[{en:"My phone is ringing.",ru:"Мой телефон звонит."}]},
        "computer":{t:["компьютер"],p:"/kəmˈpjuːtər/",ex:[{en:"I work on a computer.",ru:"Я работаю на компьютере."}]},
        "car":{t:["машина"],p:"/kɑːr/",ex:[{en:"I have a new car.",ru:"У меня новая машина."}]},
        "door":{t:["дверь"],p:"/dɔːr/",ex:[{en:"Open the door.",ru:"Открой дверь."}]},
        "window":{t:["окно"],p:"/ˈwɪndoʊ/",ex:[{en:"Look out the window.",ru:"Посмотри в окно."}]},
        "table":{t:["стол"],p:"/ˈteɪbəl/",ex:[{en:"Put it on the table.",ru:"Положи на стол."}]},
        "chair":{t:["стул"],p:"/tʃer/",ex:[{en:"Sit on the chair.",ru:"Сядь на стул."}]},
        "house":{t:["дом"],p:"/haʊs/",ex:[{en:"I bought a house.",ru:"Я купил дом."}]},
        "street":{t:["улица"],p:"/striːt/",ex:[{en:"I live on this street.",ru:"Я живу на этой улице."}]},
        "road":{t:["дорога"],p:"/roʊd/",ex:[{en:"The road is long.",ru:"Дорога длинная."}]},
        "music":{t:["музыка"],p:"/ˈmjuːzɪk/",ex:[{en:"I love music.",ru:"Я люблю музыку."}]},
        "game":{t:["игра"],p:"/ɡeɪm/",ex:[{en:"Let's play a game.",ru:"Давай поиграем."}]},
        "movie":{t:["фильм"],p:"/ˈmuːvi/",ex:[{en:"Let's watch a movie.",ru:"Давай посмотрим фильм."}]},
        "question":{t:["вопрос"],p:"/ˈkwestʃən/",ex:[{en:"I have a question.",ru:"У меня вопрос."}]},
        "answer":{t:["ответ"],p:"/ˈænsər/",ex:[{en:"What is the answer?",ru:"Какой ответ?"}]},
        "problem":{t:["проблема"],p:"/ˈprɒbləm/",ex:[{en:"What's the problem?",ru:"В чём проблема?"}]},
        "idea":{t:["идея"],p:"/aɪˈdiːə/",ex:[{en:"Good idea!",ru:"Хорошая идея!"}]},
        "way":{t:["путь"],p:"/weɪ/",ex:[{en:"Which way?",ru:"Куда идти?"}]},
        "light":{t:["свет"],p:"/laɪt/",ex:[{en:"Turn on the light.",ru:"Включи свет."}]},
        "dark":{t:["тёмный"],p:"/dɑːrk/",ex:[{en:"It's dark outside.",ru:"На улице темно."}]},
        "help":{t:["помощь"],p:"/help/",ex:[{en:"Can you help me?",ru:"Можешь помочь?"}]},
        "important":{t:["важный"],p:"/ɪmˈpɔːrtənt/",ex:[{en:"This is important.",ru:"Это важно."}]},
        "different":{t:["разный"],p:"/ˈdɪfərənt/",ex:[{en:"We are different.",ru:"Мы разные."}]},
        "always":{t:["всегда"],p:"/ˈɔːlweɪz/",ex:[{en:"I will always love you.",ru:"Я всегда буду любить тебя."}]},
        "never":{t:["никогда"],p:"/ˈnevər/",ex:[{en:"I never lie.",ru:"Я никогда не лгу."}]},
        "sometimes":{t:["иногда"],p:"/ˈsʌmtaɪmz/",ex:[{en:"Sometimes I cook.",ru:"Иногда я готовлю."}]},
        "often":{t:["часто"],p:"/ˈɒfən/",ex:[{en:"I often go there.",ru:"Я часто хожу туда."}]},
        "understand":{t:["понимать"],p:"/ˌʌndərˈstænd/",ex:[{en:"I understand.",ru:"Я понимаю."}]},
        "know":{t:["знать"],p:"/noʊ/",ex:[{en:"I know the answer.",ru:"Я знаю ответ."}]},
        "think":{t:["думать"],p:"/θɪŋk/",ex:[{en:"I think so.",ru:"Я так думаю."}]},
        "want":{t:["хотеть"],p:"/wɒnt/",ex:[{en:"I want coffee.",ru:"Я хочу кофе."}]},
        "need":{t:["нуждаться"],p:"/niːd/",ex:[{en:"I need help.",ru:"Мне нужна помощь."}]},
        "like":{t:["нравиться"],p:"/laɪk/",ex:[{en:"I like pizza.",ru:"Мне нравится пицца."}]},
        "speak":{t:["говорить"],p:"/spiːk/",ex:[{en:"Do you speak English?",ru:"Вы говорите по-английски?"}]},
        "eat":{t:["есть"],p:"/iːt/",ex:[{en:"Let's eat.",ru:"Давай поедим."}]},
        "drink":{t:["пить"],p:"/drɪŋk/",ex:[{en:"I need a drink.",ru:"Мне нужно попить."}]},
        "sleep":{t:["спать"],p:"/sliːp/",ex:[{en:"I need to sleep.",ru:"Мне нужно поспать."}]},
        "run":{t:["бегать"],p:"/rʌn/",ex:[{en:"I run every morning.",ru:"Я бегаю каждое утро."}]},
        "walk":{t:["ходить"],p:"/wɔːk/",ex:[{en:"Let's go for a walk.",ru:"Давай прогуляемся."}]},
        "read":{t:["читать"],p:"/riːd/",ex:[{en:"I love to read.",ru:"Я люблю читать."}]},
        "write":{t:["писать"],p:"/raɪt/",ex:[{en:"Write your name.",ru:"Напишите своё имя."}]},
        "morning":{t:["утро"],p:"/ˈmɔːrnɪŋ/",ex:[{en:"Good morning!",ru:"Доброе утро!"}]},
        "evening":{t:["вечер"],p:"/ˈiːvnɪŋ/",ex:[{en:"Good evening!",ru:"Добрый вечер!"}]},
        "cat":{t:["кошка"],p:"/kæt/",ex:[{en:"The cat is sleeping.",ru:"Кошка спит."}]},
        "dog":{t:["собака"],p:"/dɔɡ/",ex:[{en:"I have a dog.",ru:"У меня есть собака."}]},
        "bird":{t:["птица"],p:"/bɜːrd/",ex:[{en:"The bird is singing.",ru:"Птица поёт."}]},
        "fish":{t:["рыба"],p:"/fɪʃ/",ex:[{en:"I like fish.",ru:"Я люблю рыбу."}]},
        "apple":{t:["яблоко"],p:"/ˈæpəl/",ex:[{en:"I eat an apple.",ru:"Я ем яблоко."}]},
        "bread":{t:["хлеб"],p:"/bred/",ex:[{en:"Fresh bread.",ru:"Свежий хлеб."}]},
        "milk":{t:["молоко"],p:"/mɪlk/",ex:[{en:"I drink milk.",ru:"Я пью молоко."}]},
        "coffee":{t:["кофе"],p:"/ˈkɒfi/",ex:[{en:"A cup of coffee.",ru:"Чашка кофе."}]},
        "tea":{t:["чай"],p:"/tiː/",ex:[{en:"I like tea.",ru:"Я люблю чай."}]},
        "winter":{t:["зима"],p:"/ˈwɪntər/",ex:[{en:"Winter is cold.",ru:"Зимой холодно."}]},
        "summer":{t:["лето"],p:"/ˈsʌmər/",ex:[{en:"Summer is hot.",ru:"Летом жарко."}]},
        "spring":{t:["весна"],p:"/sprɪŋ/",ex:[{en:"Spring is beautiful.",ru:"Весна прекрасна."}]},
        "autumn":{t:["осень"],p:"/ˈɔːtəm/",ex:[{en:"Autumn leaves.",ru:"Осенние листья."}]}
    };

    const extraWords = {
        "brother":"брат","sister":"сестра","mother":"мать","father":"отец","son":"сын","daughter":"дочь",
        "husband":"муж","wife":"жена","baby":"ребёнок","doctor":"врач","teacher":"учитель","student":"студент",
        "police":"полиция","hospital":"больница","bank":"банк","park":"парк","shop":"магазин",
        "restaurant":"ресторан","hotel":"отель","airport":"аэропорт","train":"поезд","bus":"автобус",
        "taxi":"такси","plane":"самолёт","beach":"пляж","island":"остров","forest":"лес","ocean":"океан",
        "lake":"озеро","weather":"погода","rain":"дождь","snow":"снег","wind":"ветер","cloud":"облако",
        "storm":"шторм","king":"король","queen":"королева","prince":"принц","princess":"принцесса",
        "army":"армия","war":"война","peace":"мир","government":"правительство","law":"закон",
        "power":"власть","freedom":"свобода","right":"право","left":"лево","north":"север","south":"юг",
        "east":"восток","west":"запад","up":"вверх","down":"вниз","here":"здесь","there":"там",
        "near":"близко","far":"далеко","inside":"внутри","outside":"снаружи","before":"до","after":"после",
        "during":"в течение","without":"без","with":"с","about":"о","against":"против","between":"между",
        "through":"через","above":"над","below":"под","behind":"позади","next":"следующий","last":"последний",
        "first":"первый","second":"второй","third":"третий","number":"число","name":"имя","word":"слово",
        "sentence":"предложение","language":"язык","english":"английский","russian":"русский",
        "people":"люди","person":"человек","thing":"вещь","place":"место","story":"история",
        "history":"история","science":"наука","art":"искусство","sport":"спорт","team":"команда",
        "player":"игрок","winner":"победитель","loser":"проигравший","price":"цена","cost":"стоимость",
        "free":"бесплатный","cheap":"дешёвый","expensive":"дорогой","rich":"богатый","poor":"бедный",
        "strong":"сильный","weak":"слабый","hard":"трудный","easy":"лёгкий","true":"правда","false":"ложь",
        "real":"настоящий","fake":"поддельный","open":"открытый","closed":"закрытый","full":"полный",
        "empty":"пустой","clean":"чистый","dirty":"грязный","safe":"безопасный","dangerous":"опасный",
        "possible":"возможный","impossible":"невозможный","correct":"правильный","wrong":"неправильный",
        "same":"одинаковый","similar":"похожий","special":"особенный","normal":"нормальный",
        "strange":"странный","funny":"смешной","serious":"серьёзный","boring":"скучный",
        "interesting":"интересный","exciting":"захватывающий","terrible":"ужасный","wonderful":"чудесный",
        "fantastic":"фантастический","excellent":"отличный","perfect":"идеальный","horrible":"ужасный",
        "delicious":"вкусный","sweet":"сладкий","salty":"солёный","spicy":"острый","bitter":"горький",
        "sour":"кислый","fresh":"свежий","rotten":"гнилой","alive":"живой","dead":"мёртвый",
        "young":"молодой","ancient":"древний","modern":"современный","future":"будущее","past":"прошлое",
        "present":"настоящее","beginning":"начало","middle":"середина","ending":"конец",
        "top":"верх","bottom":"низ","front":"перед","back":"спина","side":"сторона",
        "center":"центр","corner":"угол","edge":"край","surface":"поверхность","bottom":"дно",
        "color":"цвет","red":"красный","blue":"синий","green":"зелёный","yellow":"жёлтый",
        "orange":"оранжевый","purple":"фиолетовый","pink":"розовый","brown":"коричневый",
        "black":"чёрный","white":"белый","grey":"серый","gold":"золотой","silver":"серебряный",
        "happy":"счастливый","glad":"радостный","excited":"взволнованный","surprised":"удивлённый",
        "scared":"испуганный","nervous":"нервный","calm":"спокойный","relaxed":"расслабленный",
        "busy":"занятый","free":"свободный","ready":"готовый","late":"поздний","early":"ранний",
        "quick":"быстрый","rapid":"стремительный","sudden":"внезапный","gradual":"постепенный",
        "final":"финальный","temporary":"временный","permanent":"постоянный","local":"местный",
        "foreign":"иностранный","international":"международный","national":"национальный",
        "personal":"личный","public":"общественный","private":"частный","secret":"секретный",
        "official":"официальный","formal":"формальный","informal":"неформальный",
        "able":"способный","unable":"неспособный","willing":"готовый","unwilling":"нежелающий",
        "certain":"уверенный","uncertain":"неуверенный","likely":"вероятный","unlikely":"маловероятный",
        "common":"обычный","rare":"редкий","unique":"уникальный","ordinary":"обыкновенный",
        "extraordinary":"необычайный","natural":"естественный","artificial":"искусственный",
        "physical":"физический","mental":"умственный","emotional":"эмоциональный","spiritual":"духовный",
        "social":"социальный","cultural":"культурный","political":"политический","economic":"экономический",
        "technical":"технический","scientific":"научный","medical":"медицинский","legal":"юридический",
        "educational":"образовательный","professional":"профессиональный","amateur":"любительский"
    };

    Object.entries(baseWords).forEach(([k,v]) => { fullDictionary[k] = v; allWords.push(k); });
    Object.entries(extraWords).forEach(([en, ru]) => {
        if (!fullDictionary[en]) {
            fullDictionary[en] = { t: [ru], p: "", ex: [] };
            allWords.push(en);
        }
    });

    try {
        const cached = localStorage.getItem('dictionary_extra');
        if (cached) {
            const extra = JSON.parse(cached);
            Object.entries(extra).forEach(([k,v]) => {
                if (!fullDictionary[k]) {
                    fullDictionary[k] = v;
                    allWords.push(k);
                }
            });
        }
    } catch(e) {}

    try {
        const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt');
        if (response.ok) {
            const text = await response.text();
            const words = text.split('\n').filter(w => w.length > 2 && w.length < 15).slice(0, 7000);
            const newWords = {};
            words.forEach(w => {
                const clean = w.trim().toLowerCase();
                if (clean && !fullDictionary[clean] && /^[a-z]+$/.test(clean)) {
                    newWords[clean] = { t: [clean], p: "", ex: [] };
                }
            });
            const existingExtra = {};
            try {
                const c = localStorage.getItem('dictionary_extra');
                if (c) Object.assign(existingExtra, JSON.parse(c));
            } catch(e) {}
            Object.assign(existingExtra, newWords);
            localStorage.setItem('dictionary_extra', JSON.stringify(existingExtra));
            Object.entries(newWords).forEach(([k,v]) => {
                if (!fullDictionary[k]) {
                    fullDictionary[k] = v;
                    allWords.push(k);
                }
            });
        }
    } catch(e) {
        console.log('Using local dictionary');
    }

    allWords.sort();
    console.log(`Dictionary loaded: ${allWords.length} words`);
}

loadDictionary();
