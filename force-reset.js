require('dotenv').config();
const mongoose = require('mongoose');
const RawItem = require('./models/RawItem');
const ProcessedEvent = require('./models/ProcessedEvent');

function determineCategoryAndLevel(title, content = '') {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();
    const combinedText = lowerTitle + ' ' + lowerContent;

    // Ijtima - Religious gatherings
    if (combinedText.includes('ijtima') || combinedText.includes('اجتماع') ||
        combinedText.includes('دعوتی') || combinedText.includes('تبلیغ') ||
        combinedText.includes('جماعت') || combinedText.includes('مذہبی') ||
        combinedText.includes('عید') || combinedText.includes('رمضان') ||
        combinedText.includes('نماز') || combinedText.includes('جمعہ') ||
        combinedText.includes('دینی') || combinedText.includes('مبلغ') ||
        combinedText.includes('شیخ') || combinedText.includes('مذہب')) {
        return { category: 'Ijtima', level: 'Local' };
    }

    // Meeting - Official meetings, government sessions, administration
    if (combinedText.includes('meeting') || combinedText.includes('اجلاس') ||
        combinedText.includes('سیاسی') || combinedText.includes('وزیر') ||
        combinedText.includes('قومی اسمبلی') || combinedText.includes('پارلیمنٹ') ||
        combinedText.includes('کابینہ') || combinedText.includes('ڈپٹی کمشنر') ||
        combinedText.includes('کمشنر') || combinedText.includes('ایڈیشنل') ||
        combinedText.includes('سیکرٹری') || combinedText.includes('آفیس') ||
        combinedText.includes('سرکاری') || combinedText.includes('حکومت') ||
        combinedText.includes('ایوان') || combinedText.includes('پالیسی') ||
        combinedText.includes('president') || combinedText.includes('government') ||
        combinedText.includes('official') || combinedText.includes('minister') ||
        combinedText.includes('pemerintah') || combinedText.includes('menteri') ||
        combinedText.includes('dpr') || combinedText.includes('ruu') ||
        combinedText.includes('peraturan') || combinedText.includes('kebijakan') ||
        combinedText.includes('pemilu') || combinedText.includes('pemilihan') ||
        combinedText.includes('pengadilan') || combinedText.includes('hakim') ||
        combinedText.includes('jaksa') || combinedText.includes('hukum') ||
        combinedText.includes('polisi') || combinedText.includes('kepolisian') ||
        combinedText.includes('police') || combinedText.includes('cop') ||
        combinedText.includes('law enforcement') || combinedText.includes('legal') ||
        combinedText.includes('court') || combinedText.includes('judge') ||
        combinedText.includes('verdict') || combinedText.includes('trial') ||
        combinedText.includes('undang-undang') || combinedText.includes('perda') ||
        combinedText.includes('mk') || combinedText.includes('mahkamah')) {
        return { category: 'Meeting', level: 'District' };
    }

    // Procession - Protests, rallies, marches, demonstrations
    if (combinedText.includes('procession') || combinedText.includes('ریلی') ||
        combinedText.includes('جلسہ') || combinedText.includes('مظاہرہ') ||
        combinedText.includes('احتجاج') || combinedText.includes('ہڑتال') ||
        combinedText.includes('بور') || combinedText.includes('مزدور') ||
        combinedText.includes('طالب علم') || combinedText.includes('اساتذہ') ||
        combinedText.includes('ڈاکٹر') || combinedText.includes('وکلا') ||
        combinedText.includes('مظاہرین') || combinedText.includes('نعرہ') ||
        combinedText.includes('protest') || combinedText.includes('strike') ||
        combinedText.includes('rally') || combinedText.includes('demonstration') ||
        combinedText.includes('unjuk rasa') || combinedText.includes('demo') ||
        combinedText.includes('mogok') || combinedText.includes('buruh') ||
        combinedText.includes('pekerja') || combinedText.includes('serikat') ||
        combinedText.includes('labor') || combinedText.includes('worker') ||
        combinedText.includes('unemployment') || combinedText.includes('pengangguran') ||
        combinedText.includes('gaji') || combinedText.includes('upah') ||
        combinedText.includes('salary') || combinedText.includes('wage') ||
        combinedText.includes('minimum wage') || combinedText.includes('ump')) {
        return { category: 'Procession', level: 'Local' };
    }

    // Conference - International conferences, summits, diplomacy, business
    if (combinedText.includes('conference') || combinedText.includes('کاںفرنس') ||
        combinedText.includes('سمٹ') || combinedText.includes('بین الاقوامی') ||
        combinedText.includes('UN') || combinedText.includes('سیلون') ||
        combinedText.includes('سیمپوزیم') || combinedText.includes('کانفرنس') ||
        combinedText.includes('security council') || combinedText.includes('diplomat') ||
        combinedText.includes('international') || combinedText.includes('global') ||
        combinedText.includes('summit') || combinedText.includes('resolution') ||
        combinedText.includes('اقوام متحدہ') || combinedText.includes('سیکورٹی کونسل') ||
        combinedText.includes('un security council') || combinedText.includes('gaza') ||
        combinedText.includes('ukraine') || combinedText.includes('russia') ||
        combinedText.includes('united nations') || combinedText.includes('trump') ||
        combinedText.includes('biden') || combinedText.includes('white house') ||
        combinedText.includes('foreign') || combinedText.includes('diplomacy') ||
        combinedText.includes('business') || combinedText.includes('economy') ||
        combinedText.includes('market') || combinedText.includes('stock') ||
        combinedText.includes('trade') || combinedText.includes('investment') ||
        combinedText.includes('economic') || combinedText.includes('financial') ||
        combinedText.includes('ekonomi') || combinedText.includes('bisnis') ||
        combinedText.includes('perdagangan') || combinedText.includes('investasi') ||
        combinedText.includes('saham') || combinedText.includes('pasar') ||
        combinedText.includes('bank') || combinedText.includes('keuangan') ||
        combinedText.includes('inflasi') || combinedText.includes('harga')) {
        return { category: 'Conference', level: 'Central' };
    }

    // Seminar - Educational, training, workshops, academic, technology
    if (combinedText.includes('seminar') || combinedText.includes('سیمینار') ||
        combinedText.includes('ورکشاپ') || combinedText.includes('تعلیمی') ||
        combinedText.includes('کالج') || combinedText.includes('یونیورسٹی') ||
        combinedText.includes('اسکول') || combinedText.includes('تعلیم') ||
        combinedText.includes('امتحان') || combinedText.includes('طلبہ') ||
        combinedText.includes('تعلیمی') || combinedText.includes('اساتذہ') ||
        combinedText.includes('research') || combinedText.includes('study') ||
        combinedText.includes('education') || combinedText.includes('academic') ||
        combinedText.includes('nasa') || combinedText.includes('technology') ||
        combinedText.includes('tech') || combinedText.includes('science') ||
        combinedText.includes('digital') || combinedText.includes('AI') ||
        combinedText.includes('artificial') || combinedText.includes('ٹیکنالوجی') ||
        combinedText.includes('سائنس') || combinedText.includes('student') ||
        combinedText.includes('siswa') || combinedText.includes('sekolah') ||
        combinedText.includes('school') || combinedText.includes('university') ||
        combinedText.includes('college') || combinedText.includes('pelajar') ||
        combinedText.includes('mahasiswa') || combinedText.includes('guru') ||
        combinedText.includes('dosen') || combinedText.includes('pendidikan') ||
        combinedText.includes('sekolah') || combinedText.includes('kampus') ||
        combinedText.includes('universitas') || combinedText.includes('teknologi') ||
        combinedText.includes('digital') || combinedText.includes('internet') ||
        combinedText.includes('software') || combinedText.includes('hardware') ||
        combinedText.includes('aplikasi') || combinedText.includes('program') ||
        combinedText.includes('komputer') || combinedText.includes('smartphone') ||
        combinedText.includes('sains') || combinedText.includes('penelitian') ||
        combinedText.includes('riset') || combinedText.includes('studi')) {
        return { category: 'Seminar', level: 'District' };
    }

    // Community - Social issues, community events, cultural, sports, health, entertainment
    if (combinedText.includes('community') || combinedText.includes('سماجی') ||
        combinedText.includes('معاشرتی') || combinedText.includes('عوامی') ||
        combinedText.includes('خاندان') || combinedText.includes('شادی') ||
        combinedText.includes('تقریب') || combinedText.includes('تقاریب') ||
        combinedText.includes('تہوار') || combinedText.includes('میلہ') ||
        combinedText.includes('ثقافتی') || combinedText.includes('کلچرل') ||
        combinedText.includes('سپورٹس') || combinedText.includes('کھیل') ||
        combinedText.includes('sports') || combinedText.includes('culture') ||
        combinedText.includes('festival') || combinedText.includes('celebrat') ||
        combinedText.includes('film') || combinedText.includes('movie') ||
        combinedText.includes('music') || combinedText.includes('art') ||
        combinedText.includes('فلم') || combinedText.includes('موسیقی') ||
        combinedText.includes('world cup') || combinedText.includes('cricket') ||
        combinedText.includes('football') || combinedText.includes('sports') ||
        combinedText.includes('کھیل') || combinedText.includes('کرکٹ') ||
        combinedText.includes('health') || combinedText.includes('medical') ||
        combinedText.includes('hospital') || combinedText.includes('doctor') ||
        combinedText.includes('disease') || combinedText.includes('treatment') ||
        combinedText.includes('صحت') || combinedText.includes('طبی') ||
        combinedText.includes('indonesia') || combinedText.includes('indonesian') ||
        combinedText.includes('jakarta') || combinedText.includes('jawa') ||
        combinedText.includes('malaysia') || combinedText.includes('singapore') ||
        combinedText.includes('asia') || combinedText.includes('asian') ||
        combinedText.includes('korea') || combinedText.includes('korsel') ||
        combinedText.includes('jepang') || combinedText.includes('japan') ||
        combinedText.includes('cina') || combinedText.includes('china') ||
        combinedText.includes('landslide') || combinedText.includes('longsor') ||
        combinedText.includes('earthquake') || combinedText.includes('gempa') ||
        combinedText.includes('flood') || combinedText.includes('banjir') ||
        combinedText.includes('disaster') || combinedText.includes('bencana') ||
        combinedText.includes('accident') || combinedText.includes('kecelakaan') ||
        combinedText.includes('kebakaran') || combinedText.includes('fire') ||
        combinedText.includes('tsunami') || combinedText.includes('gunung') ||
        combinedText.includes('volcano') || combinedText.includes('letusan') ||
        combinedText.includes('crime') || combinedText.includes('kejahatan') ||
        combinedText.includes('murder') || combinedText.includes('pembunuhan') ||
        combinedText.includes('theft') || combinedText.includes('pencurian') ||
        combinedText.includes('kidnap') || combinedText.includes('penculikan') ||
        combinedText.includes('violence') || combinedText.includes('kekerasan') ||
        combinedText.includes('pembajakan') || combinedText.includes('perampokan') ||
        combinedText.includes('narkoba') || combinedText.includes('drugs') ||
        combinedText.includes('kesehatan') || combinedText.includes('rumah sakit') ||
        combinedText.includes('dokter') || combinedText.includes('pasien') ||
        combinedText.includes('penyakit') || combinedText.includes('sakit') ||
        combinedText.includes('covid') || combinedText.includes('virus') ||
        combinedText.includes('vaksin') || combinedText.includes('vaccine') ||
        combinedText.includes('olahraga') || combinedText.includes('sepak bola') ||
        combinedText.includes('bulu tangkis') || combinedText.includes('badminton') ||
        combinedText.includes('tennis') || combinedText.includes('basket') ||
        combinedText.includes('atlet') || combinedText.includes('sport') ||
        combinedText.includes('hiburan') || combinedText.includes('entertainment') ||
        combinedText.includes('artis') || combinedText.includes('celebrity') ||
        combinedText.includes('aktor') || combinedText.includes('aktris') ||
        combinedText.includes('sinema') || combinedText.includes('film') ||
        combinedText.includes('musik') || combinedText.includes('lagu') ||
        combinedText.includes('konser') || combinedText.includes('concert') ||
        combinedText.includes('k-pop') || combinedText.includes('drama') ||
        combinedText.includes('televisi') || combinedText.includes('tv') ||
        combinedText.includes('media') || combinedText.includes('sosial') ||
        combinedText.includes('tiktok') || combinedText.includes('instagram') ||
        combinedText.includes('facebook') || combinedText.includes('twitter') ||
        combinedText.includes('youtube') || combinedText.includes('influencer') ||
        combinedText.includes('pengakuan') || combinedText.includes('petugas') ||
        combinedText.includes('tunanetra') || combinedText.includes('difabel') ||
        combinedText.includes('anatomi') || combinedText.includes('fans') ||
        combinedText.includes('kisah') || combinedText.includes('cerita') ||
        combinedText.includes('turis') || combinedText.includes('turis') ||
        combinedText.includes('wisatawan') || combinedText.includes('tourist') ||
        combinedText.includes('hotel') || combinedText.includes('resort') ||
        combinedText.includes('liburan') || combinedText.includes('holiday') ||
        combinedText.includes('kuliner') || combinedText.includes('food') ||
        combinedText.includes('restoran') || combinedText.includes('restaurant') ||
        combinedText.includes('masakan') || combinedText.includes('cuisine') ||
        combinedText.includes('seni') || combinedText.includes('art') ||
        combinedText.includes('budaya') || combinedText.includes('culture') ||
        combinedText.includes('tradisi') || combinedText.includes('tradition') ||
        combinedText.includes('adat') || combinedText.includes('custom') ||
        combinedText.includes('keluarga') || combinedText.includes('family') ||
        combinedText.includes('anak') || combinedText.includes('child') ||
        combinedText.includes('perempuan') || combinedText.includes('wanita') ||
        combinedText.includes('pernikahan') || combinedText.includes('marriage') ||
        combinedText.includes('cinta') || combinedText.includes('love') ||
        combinedText.includes('hubungan') || combinedText.includes('relationship') ||
        combinedText.includes('masyarakat') || combinedText.includes('society') ||
        combinedText.includes('komunitas') || combinedText.includes('community') ||
        combinedText.includes('lingkungan') || combinedText.includes('environment') ||
        combinedText.includes('alam') || combinedText.includes('nature') ||
        combinedText.includes('hewan') || combinedText.includes('animal') ||
        combinedText.includes('satwa') || combinedText.includes('wildlife') ||
        combinedText.includes('tumbuhan') || combinedText.includes('plant')) {
        return { category: 'Community', level: 'Local' };
    }

    // Default for general news
    return { category: 'Other', level: 'Other' };
}

// Enhanced location detection for Pakistan
function detectPakistaniLocation(title, content = '') {
    const combinedText = (title + ' ' + content).toLowerCase();

    // Major cities - using English keys to avoid Unicode issues
    const cities = {
        'karachi': 'کراچی',
        'lahore': 'لاہور',
        'islamabad': 'اسلام آباد',
        'rawalpindi': 'راولپنڈی',
        'peshawar': 'پشاور',
        'quetta': 'کوئٹہ',
        'faisalabad': 'فیصل آباد',
        'multan': 'ملتان',
        'hyderabad': 'حیدرآباد',
        'gujranwala': 'گوجرانوالہ',
        'sialkot': 'سیالکوٹ',
        'sargodha': 'سرگودھا',
        'bahawalpur': 'بہاولپور',
        'sukkur': 'سکھر',
        'larkana': 'لارکاݨا'
    };

    for (const [english, urdu] of Object.entries(cities)) {
        if (combinedText.includes(urdu.toLowerCase()) || combinedText.includes(english.toLowerCase())) {
            return urdu;
        }
    }

    // Provinces - using English keys
    const provinces = {
        'sindh': 'سندھ',
        'punjab': 'پنجاب',
        'kpk': 'خیبر پختونخوا',
        'balochistan': 'بلوچستان',
        'gb': 'گلگت بلتستان',
        'kashmir': 'آزاد کشمیر'
    };

    for (const [english, urdu] of Object.entries(provinces)) {
        if (combinedText.includes(urdu.toLowerCase()) || combinedText.includes(english.toLowerCase())) {
            return urdu;
        }
    }

    return null;
}

// Enhanced Urdu summary generator for Pakistani context
function generateUrduSummary(title, category, location) {
    const summaries = {
        'Ijtima': [
            "مذہبی اجتماع میں شرکت کے لیے عوام کی بڑی تعداد موجود ہے۔",
            "دعوتی اجتماع میں امت مسلمہ کے اتحاد پر زور دیا گیا۔",
            "مذہبی تقریب میں معاشرتی اصلاح کے موضوع پر خطاب کیا گیا۔"
        ],
        'Meeting': [
            "سرکاری اجلاس میں عوامی مسائل پر غور کیا گیا۔",
            "انتظامی میٹنگ میں ترقیاتی منصوبوں پر تبادلہ خیال ہوا۔",
            "سرکاری اجلاس میں پالیسی سازی پر بات چیت ہوئی۔"
        ],
        'Procession': [
            "عوامی مظاہرے میں مطالبات کے حق میں نعرے بازی ہوئی۔",
            "احتجاجی ریلی میں انصاف کے لیے آواز بلند کی گئی۔",
            "مظاہرین نے اپنے مطالبات منوانے کے لیے ریلی نکالی۔"
        ],
        'Conference': [
            "بین الاقوامی کانفرنس میں اہم معاملات پر تبادلہ خیال ہوا۔",
            "کانفرنس میں ماہرین نے اپنے خیالات کا اظہار کیا۔",
            "بین الاقوامی اجلاس میں شرکاء نے تجاویز پیش کیں۔"
        ],
        'Seminar': [
            "تعلیمی سیمینار میں طلبہ کی صلاحیتیں اجاگر کی گئیں۔",
            "ورکشاپ میں شرکاء نے نئی مہارتیں سیکھیں۔",
            "تعلیمی تقریب میں مستقبل کے منصوبوں پر بات چیت ہوئی۔"
        ],
        'Community': [
            "سماجی تقریب میں برادری کے افراد نے بڑھ چڑھ کر حصہ لیا۔",
            "ثقافتی میلے میں روایتی رقص اور موسیقی پیش کی گئی۔",
            "عوامی تقریب میں خوشی اور مسرت کا ماحول تھا۔"
        ],
        'Other': [
            "مقامی سطح پر اہم واقعہ پیش آیا ہے۔",
            "علاقے میں معمولات زندگی پر اثر انداز ہونے والا واقعہ۔",
            "مقامی آبادی کے لیے اہم خبر۔"
        ]
    };

    const categorySummaries = summaries[category] || summaries['Other'];
    const randomSummary = categorySummaries[Math.floor(Math.random() * categorySummaries.length)];

    if (location) {
        return location + ' میں ' + randomSummary;
    }

    return randomSummary;
}

async function forceReset() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log('🔄 FORCE RESETTING SYSTEM...');

        // 1. Delete all processed events
        const deletedEvents = await ProcessedEvent.deleteMany({});
        console.log('🗑️ Deleted ' + deletedEvents.deletedCount + ' processed events');

        // 2. Reset all raw items to pending
        const resetItems = await RawItem.updateMany({}, { $set: { status: 'pending' } });
        console.log('🔄 Reset ' + resetItems.modifiedCount + ' raw items to pending');

        // 3. Count pending items
        const pendingCount = await RawItem.countDocuments({ status: 'pending' });
        console.log('📊 Now have ' + pendingCount + ' pending items');

        // 4. Process them with enhanced Pakistani local news coverage
        if (pendingCount > 0) {
            console.log('\n🤖 CREATING ENHANCED URDU SUMMARIES...');
            const pendingItems = await RawItem.find({ status: 'pending' });
            let successCount = 0;
            let failCount = 0;

            for (const item of pendingItems) {
                try {
                    // Fixed optional chaining syntax
                    const title = (item.raw && item.raw.title) || 'No Title';
                    const content = (item.raw && item.raw.content) || (item.raw && item.raw.description) || '';

                    // Enhanced categorization
                    const { category, level } = determineCategoryAndLevel(title, content);

                    // Detect location
                    const location = detectPakistaniLocation(title, content);

                    // Generate Urdu title
                    let title_ur;
                    if (location) {
                        const shortenedTitle = title.length > 30 ? title.substring(0, 30) + '...' : title;
                        title_ur = location + ': ' + shortenedTitle;
                    } else if (title.includes('Pakistan') || title.includes('پاکستان')) {
                        const shortenedTitle = title.length > 35 ? title.substring(0, 35) + '...' : title;
                        title_ur = 'پاکستان: ' + shortenedTitle;
                    } else {
                        const shortenedTitle = title.length > 40 ? title.substring(0, 40) + '...' : title;
                        title_ur = 'خبر: ' + shortenedTitle;
                    }

                    // Generate context-aware Urdu summary
                    const summary_ur = generateUrduSummary(title, category, location);

                    // Enhanced hashtags based on category and location
                    let hashtags = ['تازہ', 'خبریں'];
                    if (location) hashtags.push(location);
                    if (category !== 'Other') hashtags.push(category);

                    const processedEvent = new ProcessedEvent({
                        rawId: item._id,
                        title_ur: title_ur,
                        summary_ur: summary_ur,
                        datetime: (item.raw && item.raw.pubDate) || new Date(),
                        level: level,
                        category: category,
                        location: location,
                        hashtags: hashtags,
                        sourceUrl: (item.raw && item.raw.link) || '',
                        status: 'published'
                    });

                    await processedEvent.save();
                    item.status = 'processed';
                    await item.save();

                    console.log('✅ ' + title_ur + ' [' + category + ']');
                    successCount++;

                } catch (error) {
                    console.log('❌ Failed: ' + error.message);
                    item.status = 'failed';
                    await item.save();
                    failCount++;
                }
            }

            console.log('\n🎉 SUCCESS: Created ' + successCount + ' enhanced Urdu summaries!');
            console.log('📊 Categories utilized: Ijtima, Meeting, Procession, Conference, Seminar, Community, Other');
            if (failCount > 0) {
                console.log('❌ Failed: ' + failCount + ' items');
            }
        } else {
            console.log('❌ No items to process. Need to fetch new RSS data.');
        }

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        process.exit(0);
    }
}

forceReset();