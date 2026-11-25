// Source translations. Segment ordering is declared alongside each group;
// parsing validates every segment so a missing value cannot shift a locale.
const groups=[
 'cutMode square rectangular mixed random image level language shuffle hint reset save replay pause resume abandon elapsed best cuts',
 'help waiting board privacy completed progress moves congrats finalTime newRecord abandoned',
 'invalidDimensions openError invalidImage tooLarge readError chooseFirst saved noSpace',
 'levelNames',
 'multiTitle back images count total perImage start load loading noSaved multiHelp multiPrivacy',
];
const source={
zh:[
'切割方式|方形|长方形|混合|随机|图片|关卡|语言|打乱|提示|重置|保存在此设备|再玩一次|暂停|继续|放弃|用时|最佳用时|块',
'选择图片并重新排列拼图块。|等待图片。|拼图板|数据仅保存在此浏览器中，不会跨设备同步。|已完成|进度|步数|恭喜！🎉|最终用时|个人新纪录！|已放弃本局。',
'图片尺寸无效。|无法打开图片。|请选择有效图片。|图片过大（上限 8 MB）。|无法读取图片。|请先选择图片。|已保存在此浏览器。|存储空间不足，请尝试较小的图片。',
'认识图片|看见图片|分析图片|发现图片|了解图片|编码图片|谈论图片|绘制图片|创作图片|雕塑图片',
'混合拼图|返回单图模式|图片数量|块数|总块数|每张图片的块数|开始|载入已保存的游戏|正在打开图片…|未找到兼容的存档。|点击两块即可交换，支持跨拼图板。完成所有拼图板才会记录时间。|每张图片最多 8 MB。图片、存档和纪录仅保存在此浏览器。'
],
hi:[
'कट का प्रकार|वर्गाकार|आयताकार|मिश्रित|यादृच्छिक|चित्र|स्तर|भाषा|फेरबदल|संकेत|फिर शुरू करें|इस डिवाइस पर सहेजें|फिर खेलें|रोकें|जारी रखें|छोड़ें|समय|सर्वश्रेष्ठ समय|टुकड़े',
'एक चित्र चुनें और टुकड़ों को सही जगह लगाएँ।|चित्र की प्रतीक्षा है।|पहेली बोर्ड|डेटा इसी ब्राउज़र में रहता है। उपकरणों के बीच समन्वयन नहीं होता।|पूरा हुआ|प्रगति|चालें|बधाई! 🎉|अंतिम समय|नया व्यक्तिगत रिकॉर्ड!|खेल छोड़ दिया गया।',
'चित्र का आकार अमान्य है।|चित्र नहीं खुल सका।|मान्य चित्र चुनें।|चित्र बहुत बड़ा है (अधिकतम 8 MB)।|चित्र पढ़ा नहीं जा सका।|पहले कोई चित्र चुनें।|इस ब्राउज़र में सहेजा गया।|जगह कम है। छोटा चित्र आज़माएँ।',
'चित्र से परिचय|चित्र को देखना|चित्र का विश्लेषण|चित्र की खोज|चित्र को समझना|चित्र की कोडिंग|चित्र पर चर्चा|चित्र बनाना|चित्र की रचना|चित्र को तराशना',
'मिश्रित चित्र|एक चित्र पर लौटें|चित्रों की संख्या|टुकड़ों की गिनती|कुल टुकड़े|हर चित्र के टुकड़े|शुरू करें|सहेजा खेल खोलें|चित्र खुल रहे हैं…|कोई संगत सहेजा खेल नहीं मिला।|बदलने के लिए दो टुकड़े चुनें, चाहे वे अलग बोर्डों पर हों। समय दर्ज करने के लिए सभी बोर्ड पूरे करें।|हर चित्र के लिए अधिकतम 8 MB। चित्र, सहेजा खेल और रिकॉर्ड इसी ब्राउज़र में रहते हैं।'
],
es:[
'Forma de corte|Cuadrados|Rectángulos|Mixtos|Aleatorios|Imagen|Nivel|Idioma|Mezclar|Pista|Reiniciar|Guardar en este dispositivo|Volver a jugar|Pausar|Continuar|Abandonar|Tiempo|Mejor tiempo|piezas',
'Elige una imagen y ordena las piezas.|Esperando una imagen.|Tablero del rompecabezas|Los datos se quedan en este navegador. No se sincronizan entre dispositivos.|Completado|Progreso|Movimientos|¡Felicidades! 🎉|Tiempo final|¡Nuevo récord personal!|Partida abandonada.',
'La imagen tiene dimensiones inválidas.|No se pudo abrir la imagen.|Selecciona una imagen válida.|Imagen demasiado grande (máximo 8 MB).|No se pudo leer la imagen.|Elige primero una imagen.|Guardado en este navegador.|No hay espacio. Prueba con una imagen más pequeña.',
'Conocer la imagen|Ver la imagen|Analizar la imagen|Descubrir la imagen|Comprender la imagen|Codificar la imagen|Hablar de la imagen|Dibujar la imagen|Crear la imagen|Esculpir la imagen',
'Imágenes mezcladas|Volver a una imagen|Número de imágenes|Recuento|Piezas en total|Piezas por imagen|Empezar|Cargar partida guardada|Abriendo imágenes…|No se encontró una partida compatible.|Toca dos piezas para intercambiarlas, incluso entre tableros. Completa todos los tableros para registrar el tiempo.|Hasta 8 MB por imagen. Las imágenes, la partida guardada y los récords quedan en este navegador.'
],
fr:[
'Forme de découpe|Carrés|Rectangles|Mixtes|Aléatoires|Image|Niveau|Langue|Mélanger|Indice|Recommencer|Enregistrer sur cet appareil|Rejouer|Mettre en pause|Reprendre|Abandonner|Temps|Meilleur temps|pièces',
'Choisissez une image et remettez les pièces en place.|En attente d’une image.|Plateau du puzzle|Les données restent dans ce navigateur et ne sont pas synchronisées entre appareils.|Terminé|Progression|Coups|Bravo ! 🎉|Temps final|Nouveau record personnel !|Partie abandonnée.',
'Les dimensions de l’image ne sont pas valides.|Impossible d’ouvrir l’image.|Sélectionnez une image valide.|Image trop volumineuse (8 Mo maximum).|Impossible de lire l’image.|Choisissez d’abord une image.|Enregistré dans ce navigateur.|Espace insuffisant. Essayez une image plus petite.',
'Faire connaissance avec l’image|Voir l’image|Analyser l’image|Découvrir l’image|Comprendre l’image|Coder l’image|Parler de l’image|Dessiner l’image|Créer l’image|Sculpter l’image',
'Images mélangées|Revenir à une image|Nombre d’images|Nombre de pièces|Pièces au total|Pièces par image|Commencer|Charger la partie enregistrée|Ouverture des images…|Aucune sauvegarde compatible trouvée.|Touchez deux pièces pour les échanger, même entre plateaux. Terminez tous les plateaux pour enregistrer le temps.|8 Mo maximum par image. Les images, la partie enregistrée et les records restent dans ce navigateur.'
],
ar:[
'شكل القص|مربعات|مستطيلات|مختلطة|عشوائية|صورة|مستوى|اللغة|خلط|تلميح|البدء مجددًا|حفظ على هذا الجهاز|العب مرة أخرى|إيقاف مؤقت|متابعة|انسحاب|الوقت|أفضل وقت|قطع',
'اختر صورة ورتّب قطعها.|بانتظار اختيار صورة.|لوحة الأحجية|تظل البيانات في هذا المتصفح ولا تتزامن بين الأجهزة.|اكتمل|التقدّم|الحركات|أحسنت! 🎉|الوقت النهائي|رقم قياسي شخصي جديد!|تم الانسحاب من اللعبة.',
'أبعاد الصورة غير صالحة.|تعذّر فتح الصورة.|اختر صورة صالحة.|الصورة كبيرة جدًا (الحد الأقصى 8 ميغابايت).|تعذّرت قراءة الصورة.|اختر صورة أولًا.|تم الحفظ في هذا المتصفح.|مساحة التخزين غير كافية. جرّب صورة أصغر.',
'التعرّف على الصورة|رؤية الصورة|تحليل الصورة|اكتشاف الصورة|فهم الصورة|ترميز الصورة|الحديث عن الصورة|رسم الصورة|إنشاء الصورة|نحت الصورة',
'صور مختلطة|العودة إلى صورة واحدة|عدد الصور|عدد القطع|مجموع القطع|القطع لكل صورة|ابدأ|تحميل اللعبة المحفوظة|جارٍ فتح الصور…|لم يتم العثور على حفظ متوافق.|المس قطعتين لتبديلهما، حتى بين لوحتين. أكمل جميع اللوحات لتسجيل الوقت.|الحد الأقصى 8 ميغابايت لكل صورة. تبقى الصور واللعبة المحفوظة والأرقام القياسية في هذا المتصفح.'
],
bn:[
'কাটার ধরন|বর্গাকার|আয়তাকার|মিশ্র|এলোমেলো|ছবি|স্তর|ভাষা|এলোমেলো করুন|ইঙ্গিত|আবার শুরু করুন|এই ডিভাইসে রাখুন|আবার খেলুন|বিরতি|চালিয়ে যান|ছেড়ে দিন|সময়|সেরা সময়|টুকরো',
'একটি ছবি বেছে নিয়ে টুকরোগুলো সাজান।|ছবি বাছার অপেক্ষায়।|ধাঁধার বোর্ড|ডেটা এই ব্রাউজারেই থাকে। অন্য ডিভাইসের সঙ্গে সিঙ্ক হয় না।|সম্পন্ন|অগ্রগতি|চাল|অভিনন্দন! 🎉|চূড়ান্ত সময়|নতুন ব্যক্তিগত রেকর্ড!|খেলাটি ছেড়ে দেওয়া হয়েছে।',
'ছবির মাত্রা বৈধ নয়।|ছবিটি খোলা যায়নি।|একটি বৈধ ছবি বেছে নিন।|ছবিটি খুব বড় (সর্বোচ্চ ৮ এমবি)।|ছবিটি পড়া যায়নি।|আগে একটি ছবি বেছে নিন।|এই ব্রাউজারে সংরক্ষিত।|জায়গা কম। আরও ছোট ছবি চেষ্টা করুন।',
'ছবির সঙ্গে পরিচয়|ছবি দেখা|ছবি বিশ্লেষণ|ছবি আবিষ্কার|ছবি বোঝা|ছবি কোড করা|ছবি নিয়ে কথা|ছবি আঁকা|ছবি তৈরি|ছবি খোদাই',
'মিশ্র ছবি|একটি ছবিতে ফিরুন|ছবির সংখ্যা|গণনা|মোট টুকরো|প্রতি ছবির টুকরো|শুরু করুন|সংরক্ষিত খেলা খুলুন|ছবিগুলি খোলা হচ্ছে…|সামঞ্জস্যপূর্ণ সংরক্ষিত খেলা পাওয়া যায়নি।|বদলাতে দুটি টুকরো স্পর্শ করুন, সেগুলি ভিন্ন বোর্ডেও থাকতে পারে। সময় রেকর্ড করতে সব বোর্ড সম্পন্ন করুন।|প্রতি ছবি সর্বোচ্চ ৮ এমবি। ছবি, সংরক্ষিত খেলা ও রেকর্ড এই ব্রাউজারেই থাকে।'
],
ru:[
'Форма разреза|Квадраты|Прямоугольники|Смешанные|Случайные|Изображение|Уровень|Язык|Перемешать|Подсказка|Начать заново|Сохранить на этом устройстве|Сыграть снова|Пауза|Продолжить|Сдаться|Время|Лучшее время|дет.',
'Выберите изображение и соберите его из деталей.|Ожидание изображения.|Поле головоломки|Данные остаются в этом браузере и не синхронизируются между устройствами.|Готово|Прогресс|Ходы|Поздравляем! 🎉|Итоговое время|Новый личный рекорд!|Игра прервана.',
'Недопустимые размеры изображения.|Не удалось открыть изображение.|Выберите допустимое изображение.|Изображение слишком большое (максимум 8 МБ).|Не удалось прочитать изображение.|Сначала выберите изображение.|Сохранено в этом браузере.|Недостаточно места. Попробуйте изображение меньшего размера.',
'Знакомство с изображением|Просмотр изображения|Анализ изображения|Открытие изображения|Понимание изображения|Кодирование изображения|Обсуждение изображения|Рисование изображения|Создание изображения|Ваяние изображения',
'Смешанные изображения|Вернуться к одному изображению|Количество изображений|Число деталей|Всего деталей|Деталей на изображение|Начать|Загрузить сохранённую игру|Открываем изображения…|Совместимое сохранение не найдено.|Нажмите на две детали, чтобы поменять их местами, в том числе на разных полях. Соберите все поля, чтобы записать время.|До 8 МБ на изображение. Изображения, сохранение и рекорды остаются в этом браузере.'
],
id:[
'Bentuk potongan|Persegi|Persegi panjang|Campuran|Acak|Gambar|Level|Bahasa|Acak susunan|Petunjuk|Mulai ulang|Simpan di perangkat ini|Main lagi|Jeda|Lanjutkan|Menyerah|Waktu|Waktu terbaik|keping',
'Pilih gambar lalu susun kepingannya.|Menunggu gambar.|Papan teka-teki|Data tetap di peramban ini dan tidak disinkronkan antarperangkat.|Selesai|Kemajuan|Langkah|Selamat! 🎉|Waktu akhir|Rekor pribadi baru!|Permainan ditinggalkan.',
'Ukuran gambar tidak valid.|Gambar tidak dapat dibuka.|Pilih gambar yang valid.|Gambar terlalu besar (maksimal 8 MB).|Gambar tidak dapat dibaca.|Pilih gambar terlebih dahulu.|Tersimpan di peramban ini.|Ruang penyimpanan tidak cukup. Coba gambar yang lebih kecil.',
'Mengenal gambar|Melihat gambar|Menganalisis gambar|Menemukan gambar|Memahami gambar|Mengodekan gambar|Membicarakan gambar|Menggambar gambar|Menciptakan gambar|Memahat gambar',
'Gambar campuran|Kembali ke satu gambar|Jumlah gambar|Jumlah keping|Total keping|Keping per gambar|Mulai|Muat permainan tersimpan|Membuka gambar…|Tidak ada simpanan yang kompatibel.|Ketuk dua keping untuk menukarnya, termasuk di papan berbeda. Selesaikan semua papan untuk mencatat waktu.|Maksimal 8 MB per gambar. Gambar, simpanan dan rekor tetap di peramban ini.'
],
ur:[
'کٹ کی شکل|مربع|مستطیل|مخلوط|بے ترتیب|تصویر|درجہ|زبان|ترتیب بدلیں|اشارہ|دوبارہ شروع کریں|اس آلے پر محفوظ کریں|پھر کھیلیں|وقفہ|جاری رکھیں|چھوڑیں|وقت|بہترین وقت|ٹکڑے',
'ایک تصویر منتخب کریں اور اس کے ٹکڑوں کو ترتیب دیں۔|تصویر کا انتظار ہے۔|پہیلی کا تختہ|ڈیٹا اسی براؤزر میں رہتا ہے۔ آلات کے درمیان مطابقت پذیری نہیں ہوتی۔|مکمل|پیش رفت|چالیں|مبارک ہو! 🎉|حتمی وقت|نیا ذاتی ریکارڈ!|کھیل چھوڑ دیا گیا۔',
'تصویر کے ابعاد درست نہیں۔|تصویر نہیں کھل سکی۔|کوئی درست تصویر منتخب کریں۔|تصویر بہت بڑی ہے (زیادہ سے زیادہ 8 ایم بی)۔|تصویر پڑھی نہیں جا سکی۔|پہلے تصویر منتخب کریں۔|اسی براؤزر میں محفوظ ہے۔|ذخیرے میں جگہ کم ہے۔ چھوٹی تصویر آزمائیں۔',
'تصویر سے واقفیت|تصویر دیکھنا|تصویر کا تجزیہ|تصویر دریافت کرنا|تصویر سمجھنا|تصویر کی کوڈنگ|تصویر پر گفتگو|تصویر بنانا|تصویر کی تخلیق|تصویر تراشنا',
'ملی جلی تصاویر|ایک تصویر پر واپس جائیں|تصاویر کی تعداد|گنتی|کل ٹکڑے|فی تصویر ٹکڑے|شروع کریں|محفوظ کھیل کھولیں|تصاویر کھل رہی ہیں…|کوئی ہم آہنگ محفوظ کھیل نہیں ملا۔|دو ٹکڑوں کو چھو کر ان کی جگہ بدلیں، چاہے وہ الگ تختوں پر ہوں۔ وقت ریکارڈ کرنے کے لیے تمام تختے مکمل کریں۔|ہر تصویر کے لیے زیادہ سے زیادہ 8 ایم بی۔ تصاویر، محفوظ کھیل اور ریکارڈ اسی براؤزر میں رہتے ہیں۔'
],
de:[
'Schnittform|Quadrate|Rechtecke|Gemischt|Zufällig|Bild|Stufe|Sprache|Mischen|Hinweis|Neu starten|Auf diesem Gerät speichern|Noch einmal spielen|Pausieren|Fortsetzen|Aufgeben|Zeit|Bestzeit|Teile',
'Wähle ein Bild aus und ordne die Teile an.|Warte auf ein Bild.|Puzzlebrett|Die Daten bleiben in diesem Browser. Es gibt keine Synchronisierung zwischen Geräten.|Abgeschlossen|Fortschritt|Züge|Glückwunsch! 🎉|Endzeit|Neue persönliche Bestzeit!|Spiel abgebrochen.',
'Das Bild hat ungültige Abmessungen.|Das Bild konnte nicht geöffnet werden.|Wähle ein gültiges Bild aus.|Das Bild ist zu groß (maximal 8 MB).|Das Bild konnte nicht gelesen werden.|Wähle zuerst ein Bild aus.|In diesem Browser gespeichert.|Zu wenig Speicherplatz. Probiere ein kleineres Bild.',
'Das Bild kennenlernen|Das Bild ansehen|Das Bild analysieren|Das Bild entdecken|Das Bild verstehen|Das Bild kodieren|Über das Bild sprechen|Das Bild zeichnen|Das Bild gestalten|Das Bild formen',
'Gemischte Bilder|Zurück zu einem Bild|Anzahl der Bilder|Teilanzahl|Teile insgesamt|Teile pro Bild|Starten|Spielstand laden|Bilder werden geöffnet…|Kein kompatibler Spielstand gefunden.|Tippe auf zwei Teile, um sie zu tauschen, auch zwischen Brettern. Löse alle Bretter, damit die Zeit zählt.|Bis zu 8 MB pro Bild. Bilder, Spielstand und Rekorde bleiben in diesem Browser.'
],
ja:[
'切り分け方|正方形|長方形|ミックス|ランダム|画像|レベル|言語|シャッフル|ヒント|最初から|この端末に保存|もう一度遊ぶ|一時停止|再開|あきらめる|時間|ベストタイム|ピース',
'画像を選び、ピースを並べ替えましょう。|画像の選択を待っています。|パズルボード|データはこのブラウザーにのみ保存され、端末間で同期されません。|完成|進行状況|手数|おめでとうございます！🎉|クリアタイム|自己ベスト更新！|ゲームを中断しました。',
'画像のサイズが無効です。|画像を開けませんでした。|有効な画像を選んでください。|画像が大きすぎます（最大 8 MB）。|画像を読み込めませんでした。|先に画像を選んでください。|このブラウザーに保存しました。|保存領域が不足しています。小さい画像でお試しください。',
'画像を知る|画像を見る|画像を分析する|画像を発見する|画像を理解する|画像をコード化する|画像を語る|画像を描く|画像を作る|画像を彫る',
'画像ミックス|画像1枚のモードに戻る|画像の枚数|ピース数|合計ピース数|画像ごとのピース数|開始|保存したゲームを読み込む|画像を開いています…|対応するセーブデータがありません。|ピースを2個タップして入れ替えます。別のボードのピースも交換できます。すべてのボードを完成させるとタイムを記録します。|画像1枚あたり最大 8 MB。画像、セーブデータ、記録はこのブラウザーにのみ保存されます。'
],
sw:[
'Umbo la vipande|Miraba|Mistatili|Mchanganyiko|Nasibu|Picha|Kiwango|Lugha|Changanya|Kidokezo|Anza upya|Hifadhi kwenye kifaa hiki|Cheza tena|Sitisha|Endelea|Acha|Muda|Muda bora|vipande',
'Chagua picha na upange vipande vyake.|Inasubiri picha.|Ubao wa fumbo|Data hubaki kwenye kivinjari hiki. Haisawazishwi kati ya vifaa.|Imekamilika|Maendeleo|Hatua|Hongera! 🎉|Muda wa mwisho|Rekodi mpya binafsi!|Mchezo umeachwa.',
'Vipimo vya picha si halali.|Picha haikuweza kufunguliwa.|Chagua picha halali.|Picha ni kubwa mno (hadi MB 8).|Picha haikuweza kusomwa.|Chagua picha kwanza.|Imehifadhiwa katika kivinjari hiki.|Nafasi haitoshi. Jaribu picha ndogo zaidi.',
'Kuifahamu picha|Kuiona picha|Kuichambua picha|Kuigundua picha|Kuielewa picha|Kuandika msimbo wa picha|Kuzungumzia picha|Kuchora picha|Kuunda picha|Kuchonga picha',
'Picha zilizochanganywa|Rudi kwenye picha moja|Idadi ya picha|Idadi ya vipande|Jumla ya vipande|Vipande kwa kila picha|Anza|Fungua mchezo uliohifadhiwa|Inafungua picha…|Hakuna mchezo uliohifadhiwa unaolingana.|Gusa vipande viwili kubadilishana nafasi, hata vikiwa kwenye mbao tofauti. Kamilisha mbao zote ili muda urekodiwe.|Hadi MB 8 kwa kila picha. Picha, mchezo uliohifadhiwa na rekodi hubaki katika kivinjari hiki.'
],
mr:[
'कापण्याचा प्रकार|चौरस|आयत|मिश्र|यादृच्छिक|चित्र|पातळी|भाषा|तुकडे मिसळा|सूचना|पुन्हा सुरू करा|या उपकरणावर जतन करा|पुन्हा खेळा|थांबवा|पुढे चालू ठेवा|खेळ सोडा|वेळ|सर्वोत्तम वेळ|तुकडे',
'एक चित्र निवडा आणि तुकडे योग्य जागी लावा.|चित्राची प्रतीक्षा आहे.|कोड्याचा फलक|डेटा याच ब्राउझरमध्ये राहतो. वेगवेगळ्या उपकरणांवर तो समक्रमित होत नाही.|पूर्ण|प्रगती|चाली|अभिनंदन! 🎉|अंतिम वेळ|नवा वैयक्तिक विक्रम!|खेळ सोडला.',
'चित्राची मापे अवैध आहेत.|चित्र उघडता आले नाही.|वैध चित्र निवडा.|चित्र खूप मोठे आहे (कमाल ८ एमबी).|चित्र वाचता आले नाही.|आधी एक चित्र निवडा.|याच ब्राउझरमध्ये जतन केले.|जागा अपुरी आहे. छोटे चित्र वापरून पाहा.',
'चित्राची ओळख|चित्र पाहणे|चित्राचे विश्लेषण|चित्राचा शोध|चित्र समजून घेणे|चित्राचे कोडिंग|चित्राविषयी चर्चा|चित्र रेखाटणे|चित्र निर्माण करणे|चित्र कोरणे',
'मिश्र चित्रे|एका चित्राकडे परत जा|चित्रांची संख्या|तुकड्यांची संख्या|एकूण तुकडे|प्रत्येक चित्राचे तुकडे|सुरू करा|जतन केलेला खेळ उघडा|चित्रे उघडत आहेत…|सुसंगत जतन केलेला खेळ सापडला नाही.|दोन तुकड्यांची अदलाबदल करण्यासाठी त्यांना स्पर्श करा; ते वेगवेगळ्या फलकांवरही असू शकतात. वेळ नोंदवण्यासाठी सर्व फलक पूर्ण करा.|प्रत्येक चित्र कमाल ८ एमबी. चित्रे, जतन केलेला खेळ आणि विक्रम याच ब्राउझरमध्ये राहतात.'
],
};
function decode(locale, segments) {
 const data={};
 for (const [i,group] of groups.entries()){
  const values=segments[i].split('|');
  if(group==='levelNames'){
   if(values.length!==10||values.some(s=>!s.trim()))throw Error('Invalid level names: '+locale);
   data.levelNames=values;
  }else{
   const keys=group.split(' ');
   if(keys.length!==values.length||values.some(s=>!s.trim()))throw Error('Invalid locale group '+i+': '+locale);
   keys.forEach((key,j)=>data[key]=values[j]);
  }
 }
 return data;
}
export const localized=Object.fromEntries(Object.entries(source).map(([locale,segments])=>[locale,decode(locale,segments)]));
