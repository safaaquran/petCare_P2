import { useEffect, useState } from "react";
import { api } from "./api";

const tabs = [
  { id: "overview" },
  { id: "adoption" },
  { id: "lostfound" },
  { id: "chat" },
  { id: "medical" }
];
const adminHiddenTabs = new Set(["chat", "medical"]);

const roleOrder = ["User", "Vet", "Admin"];
const roleLabels = {
  en: { User: "User", Vet: "Vet", Admin: "Admin" },
  ar: { User: "حساب مستخدم", Vet: "طبيب بيطري", Admin: "مشرف" }
};
const roleConfig = {
  User: {
    hint: "Adopt pets, publish updates, and track your own reports."
  },
  Vet: {
    hint: "Manage medical records and upcoming vaccine plans."
  },
  Admin: {
    hint: "Review pending posts and keep platform content approved."
  }
};

const uiText = {
  ar: {
    "languageToggle": "English",
    "graduationProject": "مشروع تخرج",
    "sidebarCopy": "منصة أردنية لتبني الحيوانات، البحث عن الحيوانات المفقودة، ومتابعة الرعاية الصحية البيطرية.",
    "roleDemoAccounts": "حسابات تجريبية",
    "showAllRoleDemos": "عرض كل الحسابات",
    "heroEyebrow": "شبكة رعاية للحيوانات في الأردن",
    "heroTitle": "إدارة التبني، بلاغات الحيوانات المفقودة، السجل الصحي، وتنبيهات المطاعيم من مكان واحد.",
    "loadingProjectData": "جاري تحميل بيانات المشروع...",
    "tab.overview": "الرئيسية",
    "tab.adoption": "التبني",
    "tab.lostfound": "المفقودات",
    "tab.chat": "المحادثة",
    "tab.medical": "الحالة الصحية",
    "auth.chooseRole": "اختر نوع الحساب للمتابعة.",
    "auth.pickAccess": "اختر طريقة الدخول المناسبة لحسابك.",
    "auth.loggedInAs": "مسجل دخول باسم",
    "auth.changeRole": "تغيير الدور",
    "auth.login": "دخول",
    "auth.register": "تسجيل",
    "auth.email": "الإيميل",
    "auth.password": "كلمة المرور",
    "auth.fullName": "الاسم الكامل",
    "auth.petcareEmail": "الإيميل لازم ينتهي بـ @petcare.com",
    "auth.phone": "رقم الهاتف",
    "auth.city": "المدينة",
    "auth.signInAs": "تسجيل الدخول كـ",
    "auth.createAccount": "إنشاء حساب",
    "auth.noAccount": "لا يوجد حساب؟ انتقل إلى التسجيل.",
    "auth.hasAccount": "لديك حساب؟ انتقل إلى تسجيل الدخول.",
    "auth.selectRole": "اختر نوع الحساب لفتح تسجيل الدخول.",
    "auth.signOut": "تسجيل خروج",
    "role.User.hint": "تبنّي الحيوانات، نشر البلاغات، ومتابعة تقاريرك.",
    "role.Vet.hint": "إدارة السجلات الصحية وخطط المطاعيم.",
    "role.Admin.hint": "مراجعة المنشورات المعلقة وتنظيم محتوى المنصة.",
    "overview.analyticsTitle": "لوحة الإحصائيات",
    "overview.users": "الحسابات المسجلة",
    "overview.vets": "الأطباء البيطريين",
    "overview.pets": "الحيوانات في النظام",
    "overview.adoptionPets": "حيوانات للتبني",
    "overview.lostReports": "بلاغات مفقودة فعالة",
    "overview.upcomingVaccines": "مطاعيم قريبة",
    "overview.animalsByType": "الحيوانات حسب النوع",
    "overview.animalsByTypeSubtitle": "توزيع الحيوانات بين التبني والمفقود والمعثور عليه.",
    "overview.mapTitle": "خريطة الحيوانات العامة",
    "overview.mapSubtitle": "اضغط على المدينة لرؤية الحيوانات الموجودة فيها.",
    "overview.notificationsTitle": "تنبيهات صاحب الحيوان",
    "overview.notificationsSubtitle": "تذكيرات المطاعيم التي تصل لصاحب الحيوان قبل الموعد.",
    "overview.signInReminders": "سجّل الدخول لعرض تنبيهات حسابك.",
    "medical.userTitle": "الحالة الصحية لحيواناتك",
    "medical.userSubtitle": "هنا تظهر الحيوانات المرتبطة بحسابك مع الحالة الصحية وخطة المطاعيم.",
    "medical.vaccineReminders": "تنبيهات المطاعيم",
    "medical.vaccineRemindersSubtitle": "التنبيهات الفعالة التي أرسلها الطبيب البيطري لحيواناتك.",
    "medical.noActiveReminders": "لا يوجد تنبيهات مطاعيم فعالة حالياً.",
    "medical.addTitle": "إضافة موعد مطعوم",
    "medical.addSubtitle": "يمكن إنشاء موعد مطعوم للحيوان، وسيصل تنبيه تلقائي لصاحب الحيوان قبل الموعد.",
    "medical.pet": "الحيوان",
    "medical.vaccineName": "اسم اللقاح / المطعوم",
    "medical.dueDate": "تاريخ الموعد",
    "medical.addVaccine": "إضافة الموعد",
    "medical.monitorTitle": "متابعة الحالة الصحية والمطاعيم",
    "medical.monitorSubtitle": "كل حيوان له بطاقة مستقلة تعرض بيانات صاحب الحيوان والتنبيهات الصحية الفعالة.",
    "medical.noPetsMonitor": "لا يوجد حيوانات للمتابعة حالياً.",
    "medical.upcomingTitle": "المطاعيم القادمة",
    "medical.upcomingSubtitle": "المواعيد القريبة تُرسل تنبيهات تلقائية لأصحاب الحيوانات، وتختفي بعد انتهاء تاريخها.",
    "medical.noUpcoming": "لا يوجد مطاعيم مستحقة خلال 30 يوم.",
    "medical.noLinkedPets": "لا يوجد حيوانات مرتبطة بحسابك حالياً.",
    "medical.petId": "رقم الحيوان",
    "medical.vaccinePlan": "خطة المطاعيم",
    "medical.recentVisits": "آخر الزيارات الصحية",
    "medical.noVaccines": "لا يوجد سجلات مطاعيم بعد.",
    "medical.noVisits": "لا يوجد زيارات طبية مسجلة لهذا الحيوان بعد.",
    "medical.activeNeeds": "احتياجات المطاعيم الفعالة",
    "medical.noActiveReminder": "لا يوجد تنبيه فعال",
    "medical.upcoming": "قادم",
    "medical.owner": "صاحب الحيوان",
    "medical.due": "الموعد",
    "medical.notify": "تنبيه",
    "medical.notified": "تم التنبيه",
    "medical.notNotified": "لم يتم التنبيه",
    "medical.status": "الحالة",
    "medical.upToDate": "المطاعيم محدثة",
    "medical.vaccinesNeeded": "مطعوم قادم",
    "common.delete": "حذف",
    "common.approve": "موافقة",
    "common.reject": "رفض",
    "common.loadingAccount": "جاري تحميل بيانات الحساب...",
    "common.of": "من",
    "unit.kg": "كغم",
    "common.loginRequired": "تسجيل الدخول مطلوب",
    "common.loginRequiredSubtitle": "يرجى تسجيل الدخول أولاً، هذا القسم يظهر بعد تسجيل الدخول.",
    "adoption.pendingTitle": "منشورات التبني المعلقة",
"adoption.pendingSubtitle": "راجع المنشورات قبل نشرها للمستخدمين.",
"adoption.noPending": "لا توجد منشورات تبني معلقة.",
"adoption.publishedTitle": "منشورات التبني المنشورة",
"adoption.noPublished": "لا توجد منشورات تبني منشورة.",
"adoption.rejectedTitle": "منشورات التبني المرفوضة",
"adoption.noRejected": "لا توجد منشورات تبني مرفوضة.",
"adoption.createTitle": "نشر حيوان للتبني",
"adoption.createSubtitle": "أضف معلومات الحيوان ليظهر بعد موافقة المشرف.",
"adoption.petName": "اسم الحيوان",
"adoption.petType": "نوع الحيوان",
"adoption.ageMonths": "العمر بالأشهر",
"adoption.neutered": "معقّم",
"adoption.weight": "الوزن بالكيلو",
"adoption.city": "المدينة",
"adoption.location": "تفاصيل الموقع",
"adoption.description": "الوصف",
"adoption.photoUrl": "رابط الصورة، اختياري إذا رفعت صورة من الجهاز",
"adoption.uploading": "جاري رفع الصورة...",
"adoption.imageReady": "الصورة جاهزة. يمكنك إرسال منشور التبني.",
"adoption.chooseImage": "اختر صورة من جهازك أو ضع رابط الصورة.",
"adoption.contactPhone": "رقم تواصل المالك",
"adoption.submit": "إرسال منشور التبني",
"adoption.onlyUsersVets": "فقط حسابات المستخدم والطبيب البيطري يمكنها نشر منشورات التبني.",
"adoption.marketplaceTitle": "سوق التبني",
"adoption.marketplaceSubtitle": "يمكن للمالكين نشر حيوانات للتبني والتواصل مع المهتمين مباشرة.",
"adoption.searchPlaceholder": "ابحث بالاسم، النوع، المدينة، أو المالك",
"adoption.search": "بحث",
"adoption.type": "النوع",
"adoption.age": "العمر",
"adoption.health": "الحالة الصحية",
"adoption.allTypes": "كل الأنواع",
"adoption.allCities": "كل المدن",
"adoption.matches": "حيوانات مطابقة",
"adoption.clearFilters": "مسح الفلاتر",
"adoption.photoUnavailable": "الصورة غير متوفرة",
"adoption.notNeutered": "غير معقّم",
"adoption.ownerPost": "هذا منشور التبني الخاص بك.",
"adoption.noMatch": "لا توجد حيوانات تطابق هذه الفلاتر.",
"adoption.noPosts": "لا توجد منشورات تبني بعد.",
"adoption.adopt": "تبنّي",
"adoption.available": "متاح",
"adoption.publishedSubtitle": "منشورات التبني الموافق عليها والظاهرة لحسابات المستخدم والطبيب البيطري.",
"adoption.rejectedSubtitle": "المنشورات المرفوضة تبقى مخفية عن المستخدمين والأطباء.",
"adoption.approve": "موافقة",
"adoption.reject": "رفض",
"adoption.delete": "حذف",
"adoption.ageNotListed": "العمر غير مذكور",
"adoption.monthsOld": "{count} شهر",
"adoption.yearsMonthsOld": "{years} سنة و {months} شهر",
"adoption.yearsOld": "{years} سنة",
"adoption.age.any": "أي عمر",
"adoption.age.baby": "صغير جداً، 0-6 أشهر",
"adoption.age.young": "صغير، 7-24 شهر",
"adoption.age.adult": "بالغ، أكثر من سنتين",
"adoption.health.any": "أي حالة صحية",
"adoption.health.neutered": "معقّم",
"adoption.health.notNeutered": "غير معقّم",
"adoption.health.not-neutered": "غير معقّم",
"pet.Cat": "قط",
"pet.Dog": "كلب",
"pet.Bird": "طائر",
"pet.Rabbit": "أرنب",
"pet.Other": "أخرى",
"lostfound.pendingLostTitle": "بلاغات الحيوانات المفقودة بانتظار الموافقة",
"lostfound.pendingLostSubtitle": "وافق على البلاغات لنشرها، أو ارفض البلاغات غير المناسبة.",
"lostfound.pendingFoundTitle": "بلاغات الحيوانات المعثور عليها بانتظار الموافقة",
"lostfound.pendingFoundSubtitle": "بلاغات الحيوانات المعثور عليها تبقى مخفية إلى أن يوافق عليها المشرف.",
"lostfound.publishedLostTitle": "بلاغات الحيوانات المفقودة المنشورة",
"lostfound.publishedLostSubtitle": "بلاغات تمت الموافقة عليها وتظهر للمستخدمين والأطباء البيطريين.",
"lostfound.publishedFoundTitle": "بلاغات الحيوانات المعثور عليها المنشورة",
"lostfound.publishedFoundSubtitle": "احذف البلاغات التي لم تعد بحاجة للظهور للعامة.",
"lostfound.myPostsTitle": "بلاغاتي",
"lostfound.myPostsSubtitle": "بلاغاتك عن الحيوانات المفقودة والمعثور عليها تظهر هنا بشكل منفصل عن بلاغات الآخرين.",
"lostfound.myLostReports": "بلاغاتي عن الحيوانات المفقودة",
"lostfound.myFoundReports": "بلاغاتي عن الحيوانات المعثور عليها",
"lostfound.searchTitle": "البحث في بلاغات المفقودات والمعثور عليها",
"lostfound.searchSubtitle": "فلتر البلاغات حسب نوع الحيوان، نوع البلاغ، العمر، أو المكان.",
"lostfound.searchPlaceholder": "ابحث باسم الحيوان، الوصف، المكان، أو جهة التواصل",
"lostfound.searchButton": "بحث",
"lostfound.post": "نوع البلاغ",
"lostfound.lostAndFound": "مفقود ومعثور عليه",
"lostfound.lostOnly": "مفقود فقط",
"lostfound.foundOnly": "معثور عليه فقط",
"lostfound.type": "نوع الحيوان",
"lostfound.age": "العمر",
"lostfound.place": "المكان",
"lostfound.allTypes": "كل الأنواع",
"lostfound.allPlaces": "كل الأماكن",
"lostfound.clearFilters": "مسح الفلاتر",
"lostfound.reportsMatch": "بلاغات مطابقة",
"lostfound.communityLostTitle": "حيوانات مفقودة من المجتمع",
"lostfound.communityLostSubtitle": "بلاغات حيوانات مفقودة تمت الموافقة عليها من حسابات أخرى.",
"lostfound.communityFoundTitle": "حيوانات معثور عليها من المجتمع",
"lostfound.communityFoundSubtitle": "بلاغات حيوانات معثور عليها تمت الموافقة عليها من حسابات أخرى.",
"lostfound.publishTitle": "نشر بلاغ مفقود / معثور عليه",
"lostfound.publishSubtitle": "يتم حفظ البلاغ كقيد المراجعة، ويظهر للعامة فقط بعد موافقة المشرف.",
"lostfound.reportLostTitle": "إضافة بلاغ حيوان مفقود",
"lostfound.reportFoundTitle": "إضافة بلاغ حيوان معثور عليه",
"lostfound.petName": "اسم الحيوان",
"lostfound.description": "الوصف",
"lostfound.approximateAge": "العمر التقريبي بالأشهر",
"lostfound.lastSeenPlace": "آخر مكان شوهد فيه",
"lostfound.lastSeenDate": "تاريخ آخر مشاهدة",
"lostfound.foundPlace": "مكان العثور",
"lostfound.foundDate": "تاريخ العثور",
"lostfound.rewardAmount": "قيمة المكافأة، اختياري",
"lostfound.contactName": "اسم جهة التواصل",
"lostfound.contactPhone": "رقم التواصل",
"lostfound.photoUrl": "رابط الصورة",
"lostfound.uploadingImage": "جاري رفع الصورة...",
"lostfound.imageReady": "الصورة جاهزة. يمكنك إرسال البلاغ.",
"lostfound.chooseImage": "اختر صورة من جهازك، أو الصق رابط الصورة.",
"lostfound.submitLost": "إرسال بلاغ مفقود",
"lostfound.submitFound": "إرسال بلاغ معثور عليه",
"lostfound.noPendingLost": "لا توجد بلاغات مفقودة بانتظار الموافقة.",
"lostfound.noPendingFound": "لا توجد بلاغات معثور عليها بانتظار الموافقة.",
"lostfound.noPublishedLost": "لا توجد بلاغات مفقودة منشورة.",
"lostfound.noPublishedFound": "لا توجد بلاغات معثور عليها منشورة.",
"lostfound.noMyLost": "لم تقم بإرسال بلاغات عن حيوانات مفقودة بعد.",
"lostfound.noMyFound": "لم تقم بإرسال بلاغات عن حيوانات معثور عليها بعد.",
"lostfound.noLostMatches": "لا توجد بلاغات مفقودة مطابقة لهذه الفلاتر.",
"lostfound.noLostPosts": "لا توجد بلاغات مفقودة منشورة من حسابات أخرى.",
"lostfound.noFoundMatches": "لا توجد بلاغات معثور عليها مطابقة لهذه الفلاتر.",
"lostfound.noFoundPosts": "لا توجد بلاغات معثور عليها منشورة من حسابات أخرى.",
"lostfound.onlyUsersVets": "فقط حسابات المستخدم والطبيب البيطري يمكنها نشر بلاغات المفقودات والمعثور عليها.",
"lostfound.contact": "التواصل",
"lostfound.reward": "المكافأة",
"lostfound.noReward": "لا توجد مكافأة مذكورة",
"lostfound.messageOwner": "مراسلة صاحب البلاغ",
"lostfound.messageFinder": "مراسلة صاحب بلاغ العثور",
"lostfound.approve": "موافقة",
"lostfound.reject": "رفض",
"lostfound.delete": "حذف",
"lostfound.sentLostNotice": "تم إرسال بلاغ الحيوان المفقود بنجاح. سيظهر بعد موافقة المشرف.",
"lostfound.sentFoundNotice": "تم إرسال بلاغ الحيوان المعثور عليه بنجاح. سيظهر بعد موافقة المشرف.",
"lostfound.photoUploadedNotice": "تم رفع الصورة بنجاح. يمكنك الآن إرسال البلاغ.",
"lostfound.noticeApproved": "تمت الموافقة على البلاغ ونشره.",
"lostfound.noticeRejected": "تم رفض البلاغ.",
"lostfound.noticeDeleted": "تم حذف البلاغ.",
"lostfound.signInToPublishLost": "يرجى تسجيل الدخول لنشر بلاغ حيوان مفقود.",
"lostfound.signInToPublishFound": "يرجى تسجيل الدخول لنشر بلاغ حيوان معثور عليه.",
"lostfound.signInToUploadPhoto": "يرجى تسجيل الدخول أولاً لرفع صورة.",
"lostfound.adminOnlyReview": "فقط حساب المشرف يمكنه مراجعة بلاغات المفقودات والمعثور عليها.",
"lostfound.adminOnlyDelete": "فقط حساب المشرف يمكنه حذف بلاغات المفقودات والمعثور عليها.",
"lostfound.onlyUsersVetsPublish": "فقط حسابات المستخدم والطبيب البيطري يمكنها نشر بلاغات المفقودات والمعثور عليها.",
"lostfound.createLostFailed": "تعذر إرسال بلاغ الحيوان المفقود.",
"lostfound.createFoundFailed": "تعذر إرسال بلاغ الحيوان المعثور عليه.",
"lostfound.uploadFailed": "تعذر رفع هذه الصورة.",
"lostfound.updateFailed": "تعذر تحديث هذا البلاغ.",
"lostfound.deleteFailed": "تعذر حذف هذا البلاغ.",
"lostfound.messageOpened": "تم فتح المحادثة مع {name}.",
"lostfound.lostOpeningMessage": "مرحباً {name}، شاهدت بلاغك عن الحيوان المفقود {petName} وقد تكون لدي معلومات تساعدك.",
"lostfound.foundOpeningMessage": "مرحباً {name}، شاهدت بلاغ العثور على {petType} وأريد التأكد إذا كان يطابق حيواني.",
"lostfound.age.all": "أي عمر",
"lostfound.age.baby": "صغير جداً، 0-6 أشهر",
"lostfound.age.young": "صغير، 7-24 شهر",
"lostfound.age.adult": "بالغ، أكثر من سنتين",
"status.Pending": "قيد المراجعة",
"status.Approved": "مقبول",
"status.Rejected": "مرفوض",
"status.Published": "منشور",
"status.Active": "نشط",
"status.Available": "متاح",

"chat.title": "المحادثة مع الطبيب البيطري",
"chat.subtitle": "اختر طبيباً بيطرياً وابدأ محادثة مباشرة. يمكن للأطباء الرد من حساباتهم.",
"chat.startNew": "بدء محادثة جديدة",
"chat.allVetsStarted": "بدأت محادثات مع جميع الأطباء المتاحين.",
"chat.myChats": "محادثاتي",
"chat.userChats": "محادثات المستخدمين",
"chat.noMessagesYet": "لا توجد رسائل بعد.",
"chat.noChats": "لا توجد محادثات بعد.",
"chat.veterinarian": "طبيب بيطري",
"chat.petOwner": "صاحب الحيوان",
"chat.loadingMessages": "جاري تحميل الرسائل...",
"chat.noThreadMessages": "لا توجد رسائل بعد. ابدأ المحادثة الآن.",
"chat.chooseChat": "اختر محادثة من الجهة اليسرى لبدء المراسلة.",
"chat.onlyUsersVets": "المحادثة متاحة فقط لحسابات المستخدم والطبيب البيطري.",
"chat.messagePlaceholder": "اكتب رسالتك الخاصة",
"chat.send": "إرسال",
"chat.opened": "تم فتح المحادثة بنجاح.",
"chat.chooseFirst": "اختر محادثة أولاً.",
"chat.sendFailed": "تعذر إرسال الرسالة.",
"chat.deleted": "تم حذف المحادثة. يمكنك بدء محادثة جديدة مع نفس الحساب في أي وقت.",
"chat.deleteFailed": "تعذر حذف هذه المحادثة.",
"chat.noAccess": "يرجى تسجيل الدخول أولاً.",
"chat.ownPost": "هذا المنشور تابع لحسابك.",
"chat.deleteWith": "حذف المحادثة مع {name}",
"medical.onlyVetAdd": "فقط حساب الطبيب البيطري يمكنه إضافة خطط المطاعيم.",
"medical.choosePetVaccineDate": "اختر الحيوان، واسم المطعوم، وتاريخ الموعد.",
"medical.vaccineAddedNotice": "تمت إضافة موعد المطعوم. سيصل تنبيه تلقائي لصاحب الحيوان عند اقتراب الموعد.",
"medical.addFailed": "تعذر إضافة خطة المطعوم هذه.",
"medical.onlyVetNotify": "فقط حساب الطبيب البيطري يمكنه إرسال تنبيهات للمالكين.",
"medical.notificationSent": "تم إرسال التنبيه: {message}",
"medical.notifyFailed": "تعذر إرسال هذا التنبيه.",
"medical.rabiesPlaceholder": "مطعوم السعار",
"medical.roleStoryTitle": "شرح دور الطبيب البيطري",
"medical.roleStorySubtitle": "كيف تعمل متابعة الحالة الصحية في هذا المشروع.",
"medical.createHistoryTitle": "إنشاء سجل طبي",
"medical.createHistoryText": "يمكن للأطباء البيطريين إضافة ملاحظات الزيارة، التشخيص، وخطة العلاج لكل حيوان.",
"medical.updateRecordsTitle": "تحديث السجلات",
"medical.updateRecordsText": "يمكن للطبيب تعديل السجلات الطبية عند تغيّر خطة العلاج مع الوقت.",
"medical.trackVaccinesTitle": "متابعة المطاعيم",
"medical.trackVaccinesText": "النظام يحدد المطاعيم المستحقة خلال 30 يوم ويعرض تنبيهات لأصحاب الحيوانات.",
"medical.searchCollarTitle": "البحث برقم الطوق",
"medical.searchCollarText": "يمكن الوصول لأي حيوان بسرعة من خلال رقم الطوق الخاص به لعرض بيانات المالك والحالة الصحية.",
"adoption.sentNotice": "تم إرسال منشور التبني بنجاح. سيظهر بعد موافقة المشرف.",
"adoption.approvedNotice": "تمت الموافقة على منشور التبني ونشره.",
"adoption.rejectedNotice": "تم رفض منشور التبني.",
"adoption.deletedNotice": "تم حذف منشور التبني."
  }
};

function translate(language, key, fallback = key) {
  return language === "ar" ? uiText.ar[key] ?? fallback : fallback;
}

const demoCredentials = {
  User: { name: "Yaqeen Alhammad", email: "yaqeen.alhammad@petcare.com", password: "Pass123!" },
  Vet: { name: "Dr. Malak Alquraan", email: "malak.alquraan@petcare.com", password: "Pass123!" },
  Admin: { name: "Safaa Alquraan", email: "safaa.alquraan@petcare.com", password: "Pass123!" }
};

const emptyRegisterForms = {
  User: {
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
    role: "User"
  },
  Vet: {
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
    role: "Vet"
  }
};

const petTypeOptions = ["Cat", "Dog", "Bird", "Rabbit", "Other"];
const adoptionAgeOptions = [
  { value: "all", label: "Any age" },
  { value: "baby", label: "Baby (0-6 months)" },
  { value: "young", label: "Young (7-24 months)" },
  { value: "adult", label: "Adult (2+ years)" }
];
const adoptionHealthOptions = [
  { value: "all", label: "Any health status" },
  { value: "neutered", label: "Neutered" },
  { value: "not-neutered", label: "Not neutered" }
];
const wikimediaPhoto = (fileName) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=900`;

const fallbackPetPhotos = {
  Cat: wikimediaPhoto("A cat's direct gaze.jpg"),
  Dog: wikimediaPhoto("Cute dog.jpg"),
  Bird: wikimediaPhoto("Ara ararauna Luc Viatour.jpg"),
  Rabbit: wikimediaPhoto("Cute rabbit.JPG"),
  Other: wikimediaPhoto("Turtle.JPG")
};

const arabicKnownValues = {
  // Cities
  amman: "عمّان",
  zarqa: "الزرقاء",
  irbid: "إربد",
  aqaba: "العقبة",
  salt: "السلط",
  madaba: "مادبا",
  karak: "الكرك",
  tafilah: "الطفيلة",
  maan: "معان",
  mafraq: "المفرق",
  jerash: "جرش",
  ajloun: "عجلون",

  // Common places and Jordan areas
  "aqaba, south beach road": "العقبة، طريق الشاطئ الجنوبي",
  "zarqa, al-dulayl road": "الزرقاء، طريق الضليل",
  "salt, al-sarou, salt ring road": "السلط، السرو، طريق السلط الدائري",
  "irbid, al-mazar street": "إربد، شارع المزار",
  "zarqa, russeifa, yajouz road": "الزرقاء، الرصيفة، طريق ياجوز",
  "madaba, city center, talal street": "مادبا، وسط المدينة، شارع طلال",
  "zarqa, jabal tareq": "الزرقاء، جبل طارق",
  "jerash, al-mastaba road": "جرش، طريق المصطبة",
  "irbid, al-husun, main street": "إربد، الحصن، الشارع الرئيسي",
  "south beach road": "طريق الشاطئ الجنوبي",
  "al-dulayl road": "طريق الضليل",
  "al-sarou": "السرو",
  "salt ring road": "طريق السلط الدائري",
  "al-mazar street": "شارع المزار",
  "russeifa": "الرصيفة",
  "yajouz road": "طريق ياجوز",
  "city center": "وسط المدينة",
  "talal street": "شارع طلال",
  "jabal tareq": "جبل طارق",
  "al-mastaba road": "طريق المصطبة",
  "al-husun": "الحصن",
  "main street": "الشارع الرئيسي",

  // Pet types and breeds
  cat: "قط",
  dog: "كلب",
  bird: "طائر",
  rabbit: "أرنب",
  other: "أخرى",
  turtle: "سلحفاة",
  persian: "قط فارسي",
  siamese: "قط سيامي",
  labrador: "لابرادور",
  husky: "هاسكي",
  parrot: "ببغاء",
  mixed: "مختلط",
  "mixed breed": "سلالة مختلطة",
  "white rabbit": "أرنب أبيض",
  "orange tabby": "قط برتقالي مخطط",
  "holland lop": "هولاند لوب",
  lionhead: "ليون هيد",
  "scottish fold": "سكوتش فولد",
  "tabby": "قط مخطط",
  "domestic shorthair": "قط منزلي قصير الشعر",
  "dutch rabbit": "أرنب هولندي",
  "dutch": "هولندي",
  "german shepherd": "جيرمن شيبرد",
  "mini rex": "ميني ريكس",
  "golden retriever": "جولدن ريتريفر",
  "beagle": "بيغل",
  "calico": "قط كاليكو",
  "grey cat": "قط رمادي",
  "ginger cat": "قط برتقالي",

  // Lost and found demo descriptions
  "yellow labrador puppy with blue collar.": "جرو لابرادور أصفر يرتدي طوقًا أزرق.",
  "young cat found near clinic entrance.": "قط صغير عُثر عليه قرب مدخل العيادة.",
  "ginger cat, very social.": "قط برتقالي اجتماعي جداً.",
  "small brown friendly dog.": "كلب بني صغير وودود.",
  "black rabbit escaped from garden.": "أرنب أسود هرب من الحديقة.",
  "black cat with a green collar.": "قط أسود يرتدي طوقًا أخضر.",
  "striped cat lost near the market.": "قط مخطط ضائع بالقرب من السوق.",
  "calico cat wearing a red collar.": "قط كاليكو يرتدي طوقًا أحمر.",
  "sand colored house cat.": "قط منزلي بلون رملي.",
  "small white rabbit found in a garden.": "أرنب أبيض صغير عُثر عليه في حديقة.",
  "grey cat found with no visible injuries.": "قط رمادي عُثر عليه دون إصابات ظاهرة.",
  "white mixed-breed dog found near the market.": "كلب أبيض من سلالة مختلطة عُثر عليه بالقرب من السوق.",
  "beagle found near a clinic.": "كلب بيغل عُثر عليه بالقرب من عيادة.",
  "brown rabbit found near school.": "أرنب بني عُثر عليه بالقرب من مدرسة.",

  // Lost and found demo places
  "amman, tabarbour, al-shahid street": "عمّان، طبربور، شارع الشهيد",
  "tabarbour": "طبربور",
  "al-shahid street": "شارع الشهيد",
  "amman, sweifieh, ali nasouh al-taher street": "عمّان، الصويفية، شارع علي نصوح الطاهر",
  "sweifieh": "الصويفية",
  "ali nasouh al-taher street": "شارع علي نصوح الطاهر",
  "salt, downtown salt, hammam street": "السلط، وسط البلد، شارع الحمام",
  "downtown salt": "وسط البلد",
  "hammam street": "شارع الحمام",
  "irbid, al-husun, petra street": "إربد، الحصن، شارع البتراء",
  "petra street": "شارع البتراء",
  "amman, jabal amman, rainbow street": "عمّان، جبل عمّان، شارع الرينبو",
  "jabal amman": "جبل عمّان",
  "rainbow street": "شارع الرينبو",
  "zarqa, al-hussein district": "الزرقاء، حي الحسين",
  "al-hussein district": "حي الحسين",
  "madaba, mount nebo road": "مادبا، طريق جبل نيبو",
  "mount nebo road": "طريق جبل نيبو",
  "irbid, al-husun, yarmouk road": "إربد، الحصن، شارع اليرموك",
  "yarmouk road": "شارع اليرموك",
  "amman, al-madina street": "عمّان، شارع المدينة",
  "al-madina street": "شارع المدينة",
  "aqaba, tala bay road": "العقبة، طريق تالا باي",
  "tala bay road": "طريق تالا باي",

  // Demo contact names
  "mohammad abbadi": "محمد عبادي",
  "nadine shousha": "نادين شوشة",
  "tareq fares": "طارق فارس",
  "ahmad shannaq": "أحمد الشناق",
  "rama azar": "راما عازر",


  // More Jordan areas and streets
  "jerash, souf, roman road": "جرش، سوف، الطريق الروماني",
  "zarqa, new zarqa, 36th street": "الزرقاء، الزرقاء الجديدة، شارع 36",
  "irbid, university district, university street": "إربد، حي الجامعة، شارع الجامعة",
  "aqaba, al-rabieh, beach road": "العقبة، الرابية، طريق الشاطئ",
  "amman, khalda, wasfi al-tal street": "عمّان، خلدا، شارع وصفي التل",
  "amman, jabal al-weibdeh, college street": "عمّان، جبل اللويبدة، شارع الكلية",
  "amman, abdoun, cairo street": "عمّان، عبدون، شارع القاهرة",
  "souf": "سوف",
  "roman road": "الطريق الروماني",
  "new zarqa": "الزرقاء الجديدة",
  "36th street": "شارع 36",
  "university district": "حي الجامعة",
  "university street": "شارع الجامعة",
  "al-rabieh": "الرابية",
  "beach road": "طريق الشاطئ",
  "khalda": "خلدا",
  "wasfi al-tal street": "شارع وصفي التل",
  "jabal al-weibdeh": "جبل اللويبدة",
  "college street": "شارع الكلية",
  "abdoun": "عبدون",
  "cairo street": "شارع القاهرة",

  // Contact methods and statuses
  phone: "الهاتف",
  whatsapp: "واتساب",
  email: "البريد الإلكتروني",
  available: "متاح",
  pending: "قيد المراجعة",
  rejected: "مرفوض",
  active: "نشط",
  approved: "مقبول",
  published: "منشور",
  lost: "مفقود",
  found: "معثور عليه",
  "lost pet": "حيوان مفقود",
  "found pet": "حيوان معثور عليه",
  puppy: "جرو",
  kitten: "قط صغير",
  small: "صغير",
  young: "صغير",
  friendly: "ودود",
  social: "اجتماعي",
  white: "أبيض",
  black: "أسود",
  brown: "بني",
  yellow: "أصفر",
  grey: "رمادي",
  gray: "رمادي",
  ginger: "برتقالي",
  striped: "مخطط",
  collar: "طوق",
  clinic: "عيادة",
  school: "مدرسة",
  market: "السوق",
  garden: "حديقة",

  // Seed/demo descriptions used by the project
  "scout comes with a basic turtle habitat.": "سكاوت يأتي مع بيت أساسي للسلحفاة.",
  "cotton is a young rabbit ready for a first home.": "كوتون أرنب صغير جاهز لأول بيت له.",
  "leo is curious and social.": "ليو فضولي واجتماعي.",
  "max is a rescue dog looking for a second chance.": "ماكس كلب إنقاذ يبحث عن فرصة ثانية.",
  "snow is gentle and used to apartment life.": "سنو لطيف ومعتاد على حياة الشقق.",
  "lulu is affectionate and social.": "لولو حنونة واجتماعية.",
  "thor is trained and calm around people.": "ثور مدرّب وهادئ حول الناس.",
  "mochi is friendly and comfortable indoors.": "موتشي ودود ومرتاح داخل المنزل.",
  "poppy is quiet and litter trained.": "بوبي هادئة ومتدربة على صندوق الرمل.",
  "daisy is easy to handle and healthy.": "ديزي سهلة التعامل وبصحة جيدة.",
  "simba is playful and ready for a family.": "سيمبا مرح وجاهز لعائلة تهتم به.",
  "rocky needs space and daily exercise.": "روكي يحتاج مساحة وتمرين يومي.",
  "hazel is suited for a calm apartment.": "هازل مناسبة لشقة هادئة.",
  "milo needs a quiet indoor adopter.": "ميلو يحتاج متبنّي هادئ داخل المنزل.",
  "family is relocating and wants bella in a stable home.": "العائلة ستنتقل وتريد لبيلا بيتًا مستقرًا.",
  "nala needs an active adopter.": "نالا تحتاج متبنّيًا نشيطًا.",
  "comes with a basic turtle habitat.": "يأتي مع بيت أساسي للسلحفاة."
};

function normalizeLabelKey(value = "") {
  return String(value).trim().replace(/\s+/g, " ").toLowerCase();
}

function localizeKnownValue(value, language = "en") {
  if (value === null || value === undefined) {
    return "";
  }

  const originalText = String(value);
  if (language !== "ar") {
    return originalText;
  }

  const exactMatch = arabicKnownValues[normalizeLabelKey(originalText)];
  if (exactMatch) {
    return exactMatch;
  }

  const replacements = [
    ["Yellow Labrador puppy with blue collar.", "جرو لابرادور أصفر يرتدي طوقًا أزرق."],
    ["Young Cat found near clinic entrance.", "قط صغير عُثر عليه قرب مدخل العيادة."],
    ["Young cat found near clinic entrance.", "قط صغير عُثر عليه قرب مدخل العيادة."],
    ["Ginger Cat, very social.", "قط برتقالي اجتماعي جداً."],
    ["Ginger cat, very social.", "قط برتقالي اجتماعي جداً."],
    ["Small brown friendly Dog.", "كلب بني صغير وودود."],
    ["Small brown friendly dog.", "كلب بني صغير وودود."],
    ["Black Rabbit escaped from garden.", "أرنب أسود هرب من الحديقة."],
    ["Black rabbit escaped from garden.", "أرنب أسود هرب من الحديقة."],
    ["Black Cat with a green collar.", "قط أسود يرتدي طوقًا أخضر."],
    ["Black cat with a green collar.", "قط أسود يرتدي طوقًا أخضر."],
    ["Striped Cat lost near the market.", "قط مخطط ضائع بالقرب من السوق."],
    ["Striped cat lost near the market.", "قط مخطط ضائع بالقرب من السوق."],
    ["Calico Cat wearing a red collar.", "قط كاليكو يرتدي طوقًا أحمر."],
    ["Calico cat wearing a red collar.", "قط كاليكو يرتدي طوقًا أحمر."],
    ["Sand colored house Cat.", "قط منزلي بلون رملي."],
    ["Sand colored house cat.", "قط منزلي بلون رملي."],
    ["Small White Rabbit found in a garden.", "أرنب أبيض صغير عُثر عليه في حديقة."],
    ["Small white Rabbit found in a garden.", "أرنب أبيض صغير عُثر عليه في حديقة."],
    ["Small white rabbit found in a garden.", "أرنب أبيض صغير عُثر عليه في حديقة."],
    ["Grey Cat found with no visible injuries.", "قط رمادي عُثر عليه دون إصابات ظاهرة."],
    ["Grey cat found with no visible injuries.", "قط رمادي عُثر عليه دون إصابات ظاهرة."],
    ["White mixed-breed Dog found near the market.", "كلب أبيض من سلالة مختلطة عُثر عليه بالقرب من السوق."],
    ["White mixed-breed dog found near the market.", "كلب أبيض من سلالة مختلطة عُثر عليه بالقرب من السوق."],
    ["Beagle found near a clinic.", "كلب بيغل عُثر عليه بالقرب من عيادة."],
    ["Brown Rabbit found near school.", "أرنب بني عُثر عليه بالقرب من مدرسة."],
    ["Brown rabbit found near school.", "أرنب بني عُثر عليه بالقرب من مدرسة."],
    ["Amman, Tabarbour, Al-Shahid Street", "عمّان، طبربور، شارع الشهيد"],
    ["Amman, Sweifieh, Ali Nasouh Al-Taher Street", "عمّان، الصويفية، شارع علي نصوح الطاهر"],
    ["Salt, Downtown Salt, Hammam Street", "السلط، وسط البلد، شارع الحمام"],
    ["Irbid, Al-Husun, Petra Street", "إربد، الحصن، شارع البتراء"],
    ["Amman, Jabal Amman, Rainbow Street", "عمّان، جبل عمّان، شارع الرينبو"],
    ["Zarqa, Al-Hussein District", "الزرقاء، حي الحسين"],
    ["Madaba, Mount Nebo Road", "مادبا، طريق جبل نيبو"],
    ["Irbid, Al-Husun, Yarmouk Road", "إربد، الحصن، شارع اليرموك"],
    ["Amman, Al-Madina Street", "عمّان، شارع المدينة"],
    ["Aqaba, Tala Bay Road", "العقبة، طريق تالا باي"],
    ["Tabarbour", "طبربور"],
    ["Al-Shahid Street", "شارع الشهيد"],
    ["Sweifieh", "الصويفية"],
    ["Ali Nasouh Al-Taher Street", "شارع علي نصوح الطاهر"],
    ["Downtown Salt", "وسط البلد"],
    ["Hammam Street", "شارع الحمام"],
    ["Petra Street", "شارع البتراء"],
    ["Jabal Amman", "جبل عمّان"],
    ["Rainbow Street", "شارع الرينبو"],
    ["Al-Hussein District", "حي الحسين"],
    ["Mount Nebo Road", "طريق جبل نيبو"],
    ["Yarmouk Road", "شارع اليرموك"],
    ["Al-Madina Street", "شارع المدينة"],
    ["Tala Bay Road", "طريق تالا باي"],
    ["Active", "نشط"],
    ["Mohammad Abbadi", "محمد عبادي"],
    ["Nadine Shousha", "نادين شوشة"],
    ["Tareq Fares", "طارق فارس"],
    ["Ahmad Shannaq", "أحمد الشناق"],
    ["Rama Azar", "راما عازر"],
    ["lost pet", "حيوان مفقود"],
    ["found pet", "حيوان معثور عليه"],
    ["missing pet", "حيوان مفقود"],
    ["puppy", "جرو"],
    ["kitten", "قط صغير"],
    ["small", "صغير"],
    ["young", "صغير"],
    ["friendly", "ودود"],
    ["social", "اجتماعي"],
    ["calm", "هادئ"],
    ["scared", "خائف"],
    ["injured", "مصاب"],
    ["healthy", "بصحة جيدة"],
    ["white", "أبيض"],
    ["black", "أسود"],
    ["brown", "بني"],
    ["yellow", "أصفر"],
    ["grey", "رمادي"],
    ["gray", "رمادي"],
    ["ginger", "برتقالي"],
    ["striped", "مخطط"],
    ["sand colored", "بلون رملي"],
    ["blue collar", "طوق أزرق"],
    ["green collar", "طوق أخضر"],
    ["red collar", "طوق أحمر"],
    ["with collar", "يرتدي طوقًا"],
    ["without collar", "بدون طوق"],
    ["near clinic entrance", "قرب مدخل العيادة"],
    ["near clinic", "قرب عيادة"],
    ["near the market", "بالقرب من السوق"],
    ["near market", "بالقرب من السوق"],
    ["near school", "بالقرب من مدرسة"],
    ["near", "بالقرب من"],
    ["found in a garden", "عُثر عليه في حديقة"],
    ["found", "عُثر عليه"],
    ["lost", "مفقود"],
    ["escaped", "هرب"],
    ["garden", "حديقة"],
    ["clinic", "عيادة"],
    ["school", "مدرسة"],
    ["market", "السوق"],
    ["street", "شارع"],
    ["road", "طريق"],
    ["district", "حي"],
    ["downtown", "وسط البلد"],
    ["entrance", "مدخل"],
    ["collar", "طوق"],
    ["Aqaba, South Beach Road", "العقبة، طريق الشاطئ الجنوبي"],
    ["Zarqa, Al-Dulayl Road", "الزرقاء، طريق الضليل"],
    ["Salt, Al-Sarou, Salt Ring Road", "السلط، السرو، طريق السلط الدائري"],
    ["Irbid, Al-Mazar Street", "إربد، شارع المزار"],
    ["Zarqa, Russeifa, Yajouz Road", "الزرقاء، الرصيفة، طريق ياجوز"],
    ["Madaba, City Center, Talal Street", "مادبا، وسط المدينة، شارع طلال"],
    ["Zarqa, Jabal Tareq", "الزرقاء، جبل طارق"],
    ["Jerash, Al-Mastaba Road", "جرش، طريق المصطبة"],
    ["Irbid, Al-Husun, Main Street", "إربد، الحصن، الشارع الرئيسي"],
    ["South Beach Road", "طريق الشاطئ الجنوبي"],
    ["Al-Dulayl Road", "طريق الضليل"],
    ["Al-Sarou", "السرو"],
    ["Salt Ring Road", "طريق السلط الدائري"],
    ["Al-Mazar Street", "شارع المزار"],
    ["Russeifa", "الرصيفة"],
    ["Yajouz Road", "طريق ياجوز"],
    ["City Center", "وسط المدينة"],
    ["Talal Street", "شارع طلال"],
    ["Jabal Tareq", "جبل طارق"],
    ["Al-Mastaba Road", "طريق المصطبة"],
    ["Al-Husun", "الحصن"],
    ["Main Street", "الشارع الرئيسي"],
    ["Jerash, Souf, Roman Road", "جرش، سوف، الطريق الروماني"],
    ["Zarqa, New Zarqa, 36th Street", "الزرقاء، الزرقاء الجديدة، شارع 36"],
    ["Irbid, University District, University Street", "إربد، حي الجامعة، شارع الجامعة"],
    ["Aqaba, Al-Rabieh, Beach Road", "العقبة، الرابية، طريق الشاطئ"],
    ["Amman, Khalda, Wasfi Al-Tal Street", "عمّان، خلدا، شارع وصفي التل"],
    ["Amman, Jabal Al-Weibdeh, College Street", "عمّان، جبل اللويبدة، شارع الكلية"],
    ["Amman, Abdoun, Cairo Street", "عمّان، عبدون، شارع القاهرة"],
    ["University District", "حي الجامعة"],
    ["University Street", "شارع الجامعة"],
    ["New Zarqa", "الزرقاء الجديدة"],
    ["36th Street", "شارع 36"],
    ["Souf", "سوف"],
    ["Roman Road", "الطريق الروماني"],
    ["Al-Rabieh", "الرابية"],
    ["Beach Road", "طريق الشاطئ"],
    ["Khalda", "خلدا"],
    ["Wasfi Al-Tal Street", "شارع وصفي التل"],
    ["Jabal Al-Weibdeh", "جبل اللويبدة"],
    ["College Street", "شارع الكلية"],
    ["Abdoun", "عبدون"],
    ["Cairo Street", "شارع القاهرة"],
    ["Dutch Rabbit", "أرنب هولندي"],
    ["German Shepherd", "جيرمن شيبرد"],
    ["Golden Retriever", "جولدن ريتريفر"],
    ["Mini Rex", "ميني ريكس"],
    ["Mixed Breed", "سلالة مختلطة"],
    ["White Rabbit", "أرنب أبيض"],
    ["Orange Tabby", "قط برتقالي مخطط"],
    ["Holland Lop", "هولاند لوب"],
    ["Scottish Fold", "سكوتش فولد"],
    ["Domestic Shorthair", "قط منزلي قصير الشعر"],
    ["Lionhead", "ليون هيد"],
    ["Labrador", "لابرادور"],
    ["Siamese", "سيامي"],
    ["Persian", "فارسي"],
    ["Turtle", "سلحفاة"],
    ["Rabbit", "أرنب"],
    ["Cat", "قط"],
    ["Dog", "كلب"],
    ["Bird", "طائر"],
    ["Other", "أخرى"],
    ["Available", "متاح"],
    ["Pending", "قيد المراجعة"],
    ["Rejected", "مرفوض"],
    ["Phone", "الهاتف"],
    ["WhatsApp", "واتساب"],
    ["Email", "البريد الإلكتروني"],
    ["Amman", "عمّان"],
    ["Zarqa", "الزرقاء"],
    ["Irbid", "إربد"],
    ["Aqaba", "العقبة"],
    ["Salt", "السلط"],
    ["Madaba", "مادبا"],
    ["Karak", "الكرك"],
    ["Tafilah", "الطفيلة"],
    ["Maan", "معان"],
    ["Mafraq", "المفرق"],
    ["Jerash", "جرش"],
    ["Ajloun", "عجلون"]
  ];

  const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let translated = originalText;
  replacements
    .sort((first, second) => second[0].length - first[0].length)
    .forEach(([english, arabic]) => {
      translated = translated.replace(new RegExp(`\\b${escapeRegExp(english)}\\b`, "gi"), arabic);
    });

  return translated;
}

const jordanTimeFormatter = new Intl.DateTimeFormat("en-JO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Amman"
});

function formatJordanDateTime(value) {
  const textValue = String(value);
  const utcValue = /(?:Z|[+-]\d{2}:\d{2})$/.test(textValue) ? textValue : `${textValue}Z`;
  return jordanTimeFormatter.format(new Date(utcValue));
}

function createInitialAdoptionPostForm(currentUser) {
  return {
    petName: "",
    petType: "Cat",
    ageInMonths: "",
    weightKg: "",
    isNeutered: false,
    city: currentUser?.city ?? "",
    locationDetails: "",
    photoUrl: "",
    description: "",
    contactPhone: currentUser?.phoneNumber ?? ""
  };
}

function getNowLocalInputValue() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function getDateInputValue(offsetDays = 2) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function createInitialLostPostForm(currentUser) {
  return {
    petName: "",
    petType: "Cat",
    description: "",
    approximateAgeInMonths: "",
    lastSeenPlace: "",
    lastSeenDateUtc: getNowLocalInputValue(),
    rewardAmount: "",
    photoUrl: "",
    contactName: currentUser?.fullName ?? "",
    contactPhone: currentUser?.phoneNumber ?? ""
  };
}

function createInitialFoundPostForm(currentUser) {
  return {
    petType: "Cat",
    description: "",
    foundPlace: "",
    foundDateUtc: getNowLocalInputValue(),
    photoUrl: "",
    contactName: currentUser?.fullName ?? "",
    contactPhone: currentUser?.phoneNumber ?? ""
  };
}

function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong style={{ color: accent }}>{value}</strong>
    </div>
  );
}

const jordanCityPositions = {
  Irbid: { x: 22, y: 25 },
  Ajloun: { x: 17, y: 32 },
  Jerash: { x: 29, y: 35 },
  Mafraq: { x: 60, y: 28 },
  Salt: { x: 24, y: 47 },
  Amman: { x: 40, y: 44 },
  Zarqa: { x: 54, y: 43 },
  Madaba: { x: 39, y: 56 },
  Karak: { x: 47, y: 67 },
  Tafilah: { x: 40, y: 77 },
  Maan: { x: 50, y: 76 },
  Aqaba: { x: 29, y: 87 }
};

function normalizeJordanCity(city = "") {
  const value = city.trim();
  const lower = value.toLowerCase();
  const match = Object.keys(jordanCityPositions).find((name) => name.toLowerCase() === lower);
  return match ?? value;
}

function countBy(items, getKey) {
  return items.reduce((totals, item) => {
    const key = getKey(item);
    if (!key) {
      return totals;
    }

    return { ...totals, [key]: (totals[key] ?? 0) + 1 };
  }, {});
}

function formatPetAge(ageInMonths = 0, t = (key, fallback) => fallback) {
  if (ageInMonths <= 0) {
    return t("adoption.ageNotListed", "Age not listed");
  }

  if (ageInMonths < 12) {
    return t("adoption.monthsOld", `${ageInMonths} month${ageInMonths === 1 ? "" : "s"}`).replace("{count}", ageInMonths);
  }

  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  return months > 0
    ? t("adoption.yearsMonthsOld", `${years} yr ${months} mo`).replace("{years}", years).replace("{months}", months)
    : t("adoption.yearsOld", `${years} year${years === 1 ? "" : "s"}`).replace("{years}", years);
}

function matchesAdoptionAge(ageInMonths = 0, selectedAge) {
  if (selectedAge === "baby") {
    return ageInMonths >= 0 && ageInMonths <= 6;
  }

  if (selectedAge === "young") {
    return ageInMonths >= 7 && ageInMonths <= 24;
  }

  if (selectedAge === "adult") {
    return ageInMonths > 24;
  }

  return true;
}

function jordanMapQuery(location = "") {
  const value = location.trim();
  if (!value) {
    return "Jordan";
  }

  return /jordan/i.test(value) ? value : `${value}, Jordan`;
}

function JordanPetsMap({ petsByCity, pets, selectedCity, onSelectCity, cityLabel = (city) => city, language = "en" }) {
  const entries = Object.entries(petsByCity);
  const maxPets = Math.max(...entries.map(([, value]) => value), 1);
  const mappedCities = entries.filter(([city]) => jordanCityPositions[city]);
  const activeCity = selectedCity && petsByCity[selectedCity] ? selectedCity : mappedCities[0]?.[0] ?? "";
  const selectedPets = pets.filter((pet) => pet.city === activeCity);
  const mapQuery = jordanMapQuery(selectedPets[0]?.locationDetails || activeCity);
  const isArabicMap = language === "ar";
  const mapText = {
    selectedCity: isArabicMap ? "المدينة المختارة" : "Selected city",
    noCity: isArabicMap ? "لا توجد مدينة مختارة" : "No city selected",
    pets: isArabicMap ? "حيوانات" : "pets",
    adoption: isArabicMap ? "تبنّي" : "Adoption",
    lost: isArabicMap ? "مفقود" : "Lost",
    found: isArabicMap ? "معثور عليه" : "Found",
    openMaps: isArabicMap ? "فتح في خرائط Google" : "Open in Google Maps",
    empty: isArabicMap ? "اختر مدينة من الخريطة لعرض الحيوانات ومواقعها." : "Choose a city marker to see its pets and exact locations.",
    mapAlt: isArabicMap ? "خريطة الأردن" : "Jordan map outline",
    mapAria: isArabicMap ? "خريطة الحيوانات حسب مدن الأردن" : "Jordan pets by city map"
  };
  const sourceLabel = (source) => {
    if (source === "Adoption") return mapText.adoption;
    if (source === "Lost") return mapText.lost;
    if (source === "Found") return mapText.found;
    return localizeKnownValue(source, language);
  };
  const mapPetName = (pet) => {
    if (pet.source === "Found" && isArabicMap) {
      return `معثور عليه - ${localizeKnownValue(pet.type, language)}`;
    }
    return localizeKnownValue(pet.name, language);
  };

  return (
    <div className="jordan-map-layout interactive">
      <div className="jordan-map-panel" aria-label={mapText.mapAria}>
        <img className="jordan-map-template" src="/jordan-map-template.jfif" alt={mapText.mapAlt} />

        {mappedCities.map(([city, value]) => {
          const position = jordanCityPositions[city];
          const markerSize = 26 + (value / maxPets) * 10;
          return (
            <button
              key={cityLabel(city)}
              type="button"
              className={city === activeCity ? "map-city-pin active" : "map-city-pin"}
              onClick={() => onSelectCity(city)}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                "--pin-size": `${markerSize}px`
              }}
              title={`${cityLabel(city)}: ${value} ${mapText.pets}`}
            >
              <span className="map-pin-head">
                <strong>{value}</strong>
              </span>
              <span>{cityLabel(city)}</span>
            </button>
          );
        })}
      </div>

      <aside className="map-details-panel">
        <div className="map-details-head">
          <div>
            <span>{mapText.selectedCity}</span>
            <strong>{activeCity ? cityLabel(activeCity) : mapText.noCity}</strong>
          </div>
          <span className="pill success">{selectedPets.length} {mapText.pets}</span>
        </div>

        <div className="map-pet-list">
          <iframe
            className="google-map-preview"
            title={`${activeCity ? cityLabel(activeCity) : mapText.noCity} ${isArabicMap ? "خريطة الحيوانات" : "pets map"}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
            loading="lazy"
          />

          {selectedPets.length > 0 ? (
            selectedPets.map((pet) => (
              <article key={pet.id} className="map-pet-card">
                <img
                  src={pet.photoUrl}
                  alt=""
                  aria-hidden="true"
                  onError={(event) => { event.currentTarget.src = fallbackPetPhotos[pet.type] ?? fallbackPetPhotos.Other; }}
                />
                <div>
                  <strong>{mapPetName(pet)}</strong>
                  <span>{sourceLabel(pet.source)} | {localizeKnownValue(pet.type, language)} | {localizeKnownValue(pet.breed, language)}</span>
                  <p>{localizeKnownValue(pet.locationDetails || pet.city, language)}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(jordanMapQuery(pet.locationDetails || pet.city))}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {mapText.openMaps}
                  </a>
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">{mapText.empty}</p>
          )}
        </div>
      </aside>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="section-card">
      <div className="section-heading">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function PostPhoto({ src, alt, petType = "Other" }) {
  if (!src) {
    return null;
  }

  return <img className="post-photo" src={src} alt={alt} onError={(event) => { event.currentTarget.src = fallbackPetPhotos[petType] ?? fallbackPetPhotos.Other; }} />;
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M9 3h6l1 3h4v2H4V6h4l1-3Z" />
      <path d="M6 10h12l-1 10H7L6 10Zm4 2v6h2v-6h-2Zm4 0v6h2v-6h-2Z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4 21a8 8 0 0 1 16 0H4Z" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M5 3h8v2H7v14h6v2H5V3Z" />
      <path d="m16.6 7.4 4.6 4.6-4.6 4.6-1.4-1.4 2.2-2.2H10v-2h7.4l-2.2-2.2 1.4-1.4Z" />
    </svg>
  );
}

function friendlyErrorMessage(error, fallback) {
  const message = error?.message?.trim();
  if (!message || /failed to fetch/i.test(message)) {
    return fallback;
  }

  return message;
}

function AuthPanel({
  t,
  language,
  currentUser,
  selectedRole,
  setSelectedRole,
  isRoleLocked,
  setIsRoleLocked,
  authModeByRole,
  setAuthModeByRole,
  loginForms,
  setLoginForms,
  registerForms,
  setRegisterForms,
  authError,
  setAuthError,
  handleLogin,
  handleRegister,
  handleSignOut
}) {
  const selectedAuthMode = authModeByRole[selectedRole];
  const selectedLoginForm = loginForms[selectedRole];
  const selectedRegisterForm = registerForms[selectedRole];
  const canRegister = selectedRole !== "Admin";
  const visibleRolesInPanel = isRoleLocked ? [selectedRole] : roleOrder;

  return (
    <div className="login-panel">
      {!currentUser ? (
        <div className="login-panel-header">
          <strong>{t("auth.chooseRole", "Choose your role to continue.")}</strong>
          <span>{t("auth.pickAccess", "Pick the right access category for your account.")}</span>
        </div>
      ) : null}

      {!currentUser ? (
        <div className="role-list">
          {visibleRolesInPanel.map((role) => (
            <button
              key={role}
              type="button"
              className={selectedRole === role ? "role-entry active" : "role-entry"}
              onClick={() => {
                setSelectedRole(role);
                setIsRoleLocked(true);
                setAuthError("");
                setAuthModeByRole((current) => ({ ...current, [role]: "login" }));
              }}
            >
              <div className="role-entry-main">
                <div>
                  <strong>{role}</strong>
                  <p>{t(`role.${role}.hint`, roleConfig[role].hint)}</p>
                </div>
              </div>
              <span className="role-arrow">{">"}</span>
            </button>
          ))}
        </div>
      ) : null}

      {!currentUser ? (
        <>
          {isRoleLocked ? (
            <>
              <button type="button" className="role-switch-action" onClick={() => setIsRoleLocked(false)}>
                {t("auth.changeRole", "Change role")}
              </button>

              {canRegister ? (
                <div className="auth-toggle">
                  <button
                    type="button"
                    className={selectedAuthMode === "login" ? "toggle active" : "toggle"}
                    onClick={() => {
                      setAuthError("");
                      setAuthModeByRole((current) => ({ ...current, [selectedRole]: "login" }));
                    }}
                  >
                    {t("auth.login", "Login")}
                  </button>
                  <button
                    type="button"
                    className={selectedAuthMode === "register" ? "toggle active" : "toggle"}
                    onClick={() => {
                      setAuthError("");
                      setAuthModeByRole((current) => ({ ...current, [selectedRole]: "register" }));
                    }}
                  >
                    {t("auth.register", "Register")}
                  </button>
                </div>
              ) : null}

              {selectedAuthMode === "login" || !canRegister ? (
                <form className="auth-form" onSubmit={handleLogin}>
                  <input
                    type="email"
                    placeholder={t("auth.email", "Email")}
                    value={selectedLoginForm.email}
                    onChange={(event) =>
                      setLoginForms((current) => ({
                        ...current,
                        [selectedRole]: { ...current[selectedRole], email: event.target.value }
                      }))
                    }
                  />
                  <input
                    type="password"
                    placeholder={t("auth.password", "Password")}
                    value={selectedLoginForm.password}
                    onChange={(event) =>
                      setLoginForms((current) => ({
                        ...current,
                        [selectedRole]: { ...current[selectedRole], password: event.target.value }
                      }))
                    }
                  />
                  <button type="submit">{t("auth.signInAs", "Sign in as")} {roleLabels[language][selectedRole]}</button>
                </form>
              ) : (
                <form className="auth-form" onSubmit={handleRegister}>
                  <input
                    type="text"
                    placeholder={t("auth.fullName", "Full name")}
                    value={selectedRegisterForm.fullName}
                    onChange={(event) =>
                      setRegisterForms((current) => ({
                        ...current,
                        [selectedRole]: { ...current[selectedRole], fullName: event.target.value }
                      }))
                    }
                  />
                  <input
                    type="email"
                    placeholder={t("auth.petcareEmail", "Email (must end with @petcare.com)")}
                    value={selectedRegisterForm.email}
                    onChange={(event) =>
                      setRegisterForms((current) => ({
                        ...current,
                        [selectedRole]: { ...current[selectedRole], email: event.target.value }
                      }))
                    }
                  />
                  <input
                    type="password"
                    placeholder={t("auth.password", "Password")}
                    value={selectedRegisterForm.password}
                    onChange={(event) =>
                      setRegisterForms((current) => ({
                        ...current,
                        [selectedRole]: { ...current[selectedRole], password: event.target.value }
                      }))
                    }
                  />
                  <input
                    type="text"
                    placeholder={t("auth.phone", "Phone number")}
                    value={selectedRegisterForm.phoneNumber}
                    onChange={(event) =>
                      setRegisterForms((current) => ({
                        ...current,
                        [selectedRole]: { ...current[selectedRole], phoneNumber: event.target.value }
                      }))
                    }
                  />
                  <input
                    type="text"
                    placeholder={t("auth.city", "City")}
                    value={selectedRegisterForm.city}
                    onChange={(event) =>
                      setRegisterForms((current) => ({
                        ...current,
                        [selectedRole]: { ...current[selectedRole], city: event.target.value }
                      }))
                    }
                  />
                  <button type="submit">{t("auth.createAccount", "Create")} {roleLabels[language][selectedRole]}</button>
                </form>
              )}

              {authError ? <p className="form-error auth-error">{authError}</p> : null}

              {canRegister ? (
                <p className="auth-footnote">
                  {selectedAuthMode === "login" ? t("auth.noAccount", "No account yet? Choose Register.") : t("auth.hasAccount", "Already have an account? Choose Login.")}
                </p>
              ) : null}
            </>
          ) : (
            <p className="auth-note">{t("auth.selectRole", "Select one role card to open its login flow.")}</p>
          )}
        </>
      ) : (
        <div className="signed-in-card">
          <div className="signed-in-role">
            <span className="profile-icon">
              <ProfileIcon />
            </span>
            <strong>{currentUser.fullName}</strong>
          </div>
          <button type="button" className="sign-out-button" onClick={handleSignOut}>
            <SignOutIcon />
            {t("auth.signOut", "Sign out")}
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  // Adoption Arabic localization: dynamic labels enabled for cards, filters, cities, breeds, status, kg, and contact method.
  const [language, setLanguage] = useState(() => localStorage.getItem("petcareLanguage") || "en");
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboard, setDashboard] = useState(null);
  const [selectedMapCity, setSelectedMapCity] = useState("");
  const [adoptions, setAdoptions] = useState([]);
  const [adminAdoptions, setAdminAdoptions] = useState([]);
  const [lostPets, setLostPets] = useState([]);
  const [foundPets, setFoundPets] = useState([]);
  const [pendingLostPets, setPendingLostPets] = useState([]);
  const [pendingFoundPets, setPendingFoundPets] = useState([]);
  const [myLostPets, setMyLostPets] = useState([]);
  const [myFoundPets, setMyFoundPets] = useState([]);
  const [vetPets, setVetPets] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [userMedicalPets, setUserMedicalPets] = useState([]);
  const [chatVets, setChatVets] = useState([]);
  const [chatConversations, setChatConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessageDraft, setChatMessageDraft] = useState("");
  const [chatNotice, setChatNotice] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("petcareCurrentUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [privateLoading, setPrivateLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [selectedRole, setSelectedRole] = useState("User");
  const [isRoleLocked, setIsRoleLocked] = useState(false);
  const [authModeByRole, setAuthModeByRole] = useState({
    User: "login",
    Vet: "login",
    Admin: "login"
  });
  const [loginForms, setLoginForms] = useState({
    User: { email: demoCredentials.User.email, password: demoCredentials.User.password },
    Vet: { email: demoCredentials.Vet.email, password: demoCredentials.Vet.password },
    Admin: { email: demoCredentials.Admin.email, password: demoCredentials.Admin.password }
  });
  const [registerForms, setRegisterForms] = useState({
    User: { ...emptyRegisterForms.User },
    Vet: { ...emptyRegisterForms.Vet }
  });
  const [lostPostForm, setLostPostForm] = useState(() => createInitialLostPostForm(currentUser));
  const [foundPostForm, setFoundPostForm] = useState(() => createInitialFoundPostForm(currentUser));
  const [adoptionPostForm, setAdoptionPostForm] = useState(() => createInitialAdoptionPostForm(currentUser));
  const [adoptionFilters, setAdoptionFilters] = useState({
    query: "",
    type: "all",
    age: "all",
    health: "all",
    city: "all"
  });
  const [lostFoundFilters, setLostFoundFilters] = useState({
    query: "",
    type: "all",
    postKind: "all",
    age: "all",
    place: "all"
  });
  const [vaccineForm, setVaccineForm] = useState({ petId: "", vaccineName: "", dueDateUtc: getDateInputValue(2) });
  const [medicalNotice, setMedicalNotice] = useState("");
  const [adoptionNotice, setAdoptionNotice] = useState("");
  const [brokenAdoptionImages, setBrokenAdoptionImages] = useState({});
  const [lostFoundNotice, setLostFoundNotice] = useState("");
  const [adoptionPhotoUploading, setAdoptionPhotoUploading] = useState(false);
  const [lostPhotoUploading, setLostPhotoUploading] = useState(false);
  const [foundPhotoUploading, setFoundPhotoUploading] = useState(false);
  const t = (key, fallback) => translate(language, key, fallback);
  const valueLabel = (value) => localizeKnownValue(value, language);
  const petTypeLabel = (type) => t(`pet.${type}`, valueLabel(type));
  const petBreedLabel = (breed) => valueLabel(breed || t("pet.Other", "Other"));
  const cityLabel = (city) => valueLabel(city);
  const locationLabel = (location) => valueLabel(location);
  const contactMethodLabel = (method) => valueLabel(method || "Phone");
  const adoptionStoryLabel = (story) => valueLabel(story);
  const adoptionStatusLabel = (status) => valueLabel(status || "Available");
  const weightLabel = (weightKg) => `${weightKg ?? ""} ${language === "ar" ? "كغم" : "kg"}`.trim();
  const formatPetAgeLocalized = (ageInMonths = 0) => {
    const monthsCount = Number(ageInMonths || 0);

    if (language !== "ar") {
      return formatPetAge(monthsCount);
    }

    if (monthsCount <= 0) {
      return "العمر غير مذكور";
    }

    if (monthsCount < 12) {
      return `${monthsCount} شهر`;
    }

    const years = Math.floor(monthsCount / 12);
    const months = monthsCount % 12;
    return months > 0 ? `${years} سنة ${months} شهر` : `${years} سنة`;
  };
  const adoptionAgeLabel = (value, fallback) =>
    t(`adoption.age.${value}`, fallback);

  const adoptionHealthLabel = (value, fallback) => {
    const healthKey = value === "not-neutered" ? "notNeutered" : value;
    return t(`adoption.health.${healthKey}`, valueLabel(fallback));
  };
  const lostFoundStatusLabel = (status) => t(`status.${status}`, valueLabel(status || "Pending"));
  const lostFoundAgeLabel = (value, fallback) => t(`lostfound.age.${value}`, fallback);
  const lostFoundRewardLabel = (amount) =>
    amount ? `${amount} ${language === "ar" ? "د.أ" : "JOD"}` : t("lostfound.noReward", "No reward listed");
  const lostFoundMessageOpened = (name) =>
    t("lostfound.messageOpened", `Message opened with ${name}.`).replace("{name}", valueLabel(name));
  const lostFoundLostOpeningMessage = (name, petName) =>
    t("lostfound.lostOpeningMessage", `Hi ${name}, I saw your lost pet post for ${petName}. I may have information that can help.`)
      .replace("{name}", valueLabel(name))
      .replace("{petName}", petName);
  const lostFoundFoundOpeningMessage = (name, petType) =>
    t("lostfound.foundOpeningMessage", `Hi ${name}, I saw your found ${petType} report and want to check if it matches my pet.`)
      .replace("{name}", valueLabel(name))
      .replace("{petType}", petTypeLabel(petType));
  const localizeNewCommunityText = (text) => language === "ar" ? valueLabel(text) : text;
  const localizeNewLostPayload = (payload) => ({
    ...payload,
    description: localizeNewCommunityText(payload.description),
    lastSeenPlace: localizeNewCommunityText(payload.lastSeenPlace)
  });
  const localizeNewFoundPayload = (payload) => ({
    ...payload,
    description: localizeNewCommunityText(payload.description),
    foundPlace: localizeNewCommunityText(payload.foundPlace)
  });
  const isArabic = language === "ar";
  const toggleLanguage = () => setLanguage((current) => current === "en" ? "ar" : "en");

  useEffect(() => {
    localStorage.setItem("petcareLanguage", language);
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [language, isArabic]);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardData, adoptionData, lostData, foundData] = await Promise.all([
          api.getDashboard(),
          api.getAdoptions(),
          api.getLostPets(),
          api.getFoundPets()
        ]);
        setDashboard(dashboardData);
        setAdoptions(adoptionData);
        setLostPets(lostData);
        setFoundPets(foundData);
        const publicAnimalsByCity = countBy([
          ...adoptionData.map((item) => ({ city: item.city })),
          ...lostData.map((item) => ({ city: item.lastSeenPlace })),
          ...foundData.map((item) => ({ city: item.foundPlace }))
        ], (item) => normalizeJordanCity(item.city));
        const topCity = Object.entries(publicAnimalsByCity).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
        setSelectedMapCity(topCity);
      } catch {
        setError("Could not load the API. Start the backend first, then refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      localStorage.removeItem("petcareCurrentUser");
      setNotifications([]);
      return;
    }

    localStorage.setItem("petcareCurrentUser", JSON.stringify(currentUser));

    api.getNotifications(currentUser.id)
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setAdminAdoptions([]);
      setPendingLostPets([]);
      setPendingFoundPets([]);
      setMyLostPets([]);
      setMyFoundPets([]);
      setVetPets([]);
      setVaccines([]);
      setUserMedicalPets([]);
      setChatVets([]);
      setChatConversations([]);
      setSelectedConversationId(null);
      setChatMessages([]);
      setChatMessageDraft("");
      setChatNotice("");
      return;
    }

    let isCancelled = false;

    async function loadPrivateData() {
      try {
        setPrivateLoading(true);
        const isAdmin = currentUser.role === "Admin";
        const medicalRequest =
          isAdmin
            ? Promise.resolve([])
            : currentUser.role === "User"
            ? api.getMyMedicalPets(currentUser.token)
            : api.getUpcomingVaccines(currentUser.token);
        const vetPetsRequest = currentUser.role === "Vet"
          ? api.getVetMedicalPets(currentUser.token)
          : Promise.resolve([]);
        const chatConversationsRequest = isAdmin
          ? Promise.resolve([])
          : api.getMyChatConversations(currentUser.token);
        const chatVetsRequest = currentUser.role === "User" && !isAdmin
          ? api.getChatVets(currentUser.token)
          : Promise.resolve([]);
        const adoptionRequest = isAdmin
          ? api.getAdminAdoptions(currentUser.token)
          : api.getAdoptions();
        const pendingCommunityRequest = isAdmin
          ? api.getPendingCommunityReports(currentUser.token)
          : Promise.resolve({ lostReports: [], foundReports: [] });
        const myCommunityRequest = !isAdmin && (currentUser.role === "User" || currentUser.role === "Vet")
          ? api.getMyCommunityReports(currentUser.token)
          : Promise.resolve({ lostReports: [], foundReports: [] });

        const [adoptionData, lostData, foundData, medicalData, conversationData, vetsData, pendingCommunityData, myCommunityData, vetPetsData] = await Promise.all([
          adoptionRequest,
          api.getLostPets(),
          api.getFoundPets(),
          medicalRequest,
          chatConversationsRequest,
          chatVetsRequest,
          pendingCommunityRequest,
          myCommunityRequest,
          vetPetsRequest
        ]);

        if (isCancelled) {
          return;
        }

        setAdoptions(adoptionData);
        setAdminAdoptions(isAdmin ? adoptionData : []);
        setLostPets(lostData);
        setFoundPets(foundData);
        setPendingLostPets(pendingCommunityData.lostReports ?? []);
        setPendingFoundPets(pendingCommunityData.foundReports ?? []);
        setMyLostPets(myCommunityData.lostReports ?? []);
        setMyFoundPets(myCommunityData.foundReports ?? []);
        setVetPets(vetPetsData);
        setChatConversations(conversationData);
        setChatVets(vetsData);
        setSelectedConversationId((current) => {
          if (isAdmin) {
            return null;
          }

          if (!current && conversationData.length > 0) {
            return conversationData[0].id;
          }

          if (current && !conversationData.some((item) => item.id === current)) {
            return conversationData[0]?.id ?? null;
          }

          return current;
        });
        if (isAdmin) {
          setVaccines([]);
          setUserMedicalPets([]);
        } else if (currentUser.role === "User") {
          setUserMedicalPets(medicalData);
          setVaccines([]);
        } else {
          setVaccines(medicalData);
          setUserMedicalPets([]);
          setVaccineForm((current) => ({
            ...current,
            petId: current.petId || String(vetPetsData[0]?.id ?? "")
          }));
        }
      } catch {
        if (!isCancelled) {
          setError("Could not load account data. Please refresh after signing in.");
        }
      } finally {
        if (!isCancelled) {
          setPrivateLoading(false);
        }
      }
    }

    loadPrivateData();

    return () => {
      isCancelled = true;
    };
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.role) {
      setSelectedRole(currentUser.role);
      setIsRoleLocked(true);
    }
  }, [currentUser]);

  useEffect(() => {
    setAdoptionPostForm(createInitialAdoptionPostForm(currentUser));
    setLostPostForm(createInitialLostPostForm(currentUser));
    setFoundPostForm(createInitialFoundPostForm(currentUser));
    setAdoptionNotice("");
    setLostFoundNotice("");
  }, [currentUser]);

  useEffect(() => {
    const isChatRole = currentUser?.role === "User" || currentUser?.role === "Vet";
    if (!currentUser?.token || !isChatRole) {
      return;
    }

    let isCancelled = false;

    async function syncConversations() {
      try {
        const conversations = await api.getMyChatConversations(currentUser.token);
        if (isCancelled) {
          return;
        }

        setChatConversations(conversations);
        setSelectedConversationId((current) => {
          if (current && conversations.some((item) => item.id === current)) {
            return current;
          }
          return conversations[0]?.id ?? null;
        });

        if (currentUser.role === "User") {
          const vets = await api.getChatVets(currentUser.token);
          if (!isCancelled) {
            setChatVets(vets);
          }
        }
      } catch {
        if (!isCancelled) {
          setError("Could not refresh chat list.");
        }
      }
    }

    syncConversations();
    const timerId = window.setInterval(syncConversations, 5000);

    return () => {
      isCancelled = true;
      window.clearInterval(timerId);
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.token || !selectedConversationId || activeTab !== "chat") {
      setChatMessages([]);
      return;
    }

    let isCancelled = false;

    async function syncMessages() {
      try {
        setChatLoading(true);
        const messages = await api.getChatMessages(selectedConversationId, currentUser.token);
        if (!isCancelled) {
          setChatMessages(messages);
        }
      } catch {
        if (!isCancelled) {
          setError("Could not load chat messages.");
        }
      } finally {
        if (!isCancelled) {
          setChatLoading(false);
        }
      }
    }

    syncMessages();
    const timerId = window.setInterval(syncMessages, 3000);

    return () => {
      isCancelled = true;
      window.clearInterval(timerId);
    };
  }, [activeTab, currentUser, selectedConversationId]);

  useEffect(() => {
    if (activeTab !== "chat" || !selectedConversationId) {
      return;
    }

    setChatConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversationId
          ? { ...conversation, unreadIncomingCount: 0 }
          : conversation
      )
    );
  }, [activeTab, selectedConversationId]);

  const visibleDemoRoles = isRoleLocked ? [selectedRole] : roleOrder;
  const selectedConversation = chatConversations.find((item) => item.id === selectedConversationId) ?? null;
  const vetsWithoutConversation = chatVets.filter(
    (vet) => !chatConversations.some((conversation) => conversation.counterpartId === vet.id)
  );
  const isChatRole = currentUser?.role === "User" || currentUser?.role === "Vet";
  const canPublishCommunityPost = currentUser?.role === "User" || currentUser?.role === "Vet";
  const pendingAdoptions = adminAdoptions.filter((item) => item.status === "Pending");
  const publishedAdoptions = adminAdoptions.filter((item) => item.status === "Available");
  const rejectedAdoptions = adminAdoptions.filter((item) => item.status === "Rejected");
  const publicAdoptions = currentUser?.role === "Admin" ? publishedAdoptions : adoptions;
  const adoptionCityOptions = [...new Set(adoptions.map((item) => item.city).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const filteredAdoptions = adoptions.filter((item) => {
    const searchText = [
      item.petName,
      item.petType,
      item.breed,
      item.city,
      item.locationDetails,
      item.story,
      item.ownerName
    ].join(" ").toLowerCase();
    const query = adoptionFilters.query.trim().toLowerCase();

    if (query && !searchText.includes(query)) {
      return false;
    }

    if (adoptionFilters.type !== "all" && item.petType !== adoptionFilters.type) {
      return false;
    }

    if (adoptionFilters.age !== "all" && !matchesAdoptionAge(item.ageInMonths ?? 0, adoptionFilters.age)) {
      return false;
    }

    if (adoptionFilters.health === "neutered" && !item.isNeutered) {
      return false;
    }

    if (adoptionFilters.health === "not-neutered" && item.isNeutered) {
      return false;
    }

    if (adoptionFilters.city !== "all" && item.city !== adoptionFilters.city) {
      return false;
    }

    return true;
  });
  const adoptionMapPets = publicAdoptions.map((item) => ({
    id: `adoption-${item.id}`,
    name: item.petName,
    type: item.petType,
    breed: item.breed,
    city: normalizeJordanCity(item.city),
    locationDetails: item.locationDetails || item.city,
    photoUrl: item.photoUrl,
    source: "Adoption"
  }));
  const lostMapPets = lostPets.map((item) => ({
    id: `lost-${item.id}`,
    name: item.petName,
    type: item.petType,
    breed: "Lost pet",
    city: normalizeJordanCity(item.lastSeenPlace),
    locationDetails: item.lastSeenPlace,
    photoUrl: item.photoUrl,
    source: "Lost"
  }));
  const foundMapPets = foundPets.map((item) => ({
    id: `found-${item.id}`,
    name: `Found ${item.petType}`,
    type: item.petType,
    breed: "Found pet",
    city: normalizeJordanCity(item.foundPlace),
    locationDetails: item.foundPlace,
    photoUrl: item.photoUrl,
    source: "Found"
  }));
  const publicMapPets = [...adoptionMapPets, ...lostMapPets, ...foundMapPets];
  const publicPetsByCity = countBy(publicMapPets, (pet) => pet.city);
  const publicPetsByType = countBy(publicMapPets, (pet) => pet.type);
  const dashboardView = dashboard
    ? {
        ...dashboard,
        petsForAdoption: publicAdoptions.length,
        lostReports: lostPets.length,
        foundReports: foundPets.length,
        petsByType: publicMapPets.length > 0 ? publicPetsByType : dashboard.petsByType,
        petsByCity: publicPetsByCity
      }
    : null;
  const dashboardTypeTotal = dashboardView
    ? Math.max(Object.values(dashboardView.petsByType ?? {}).reduce((total, value) => total + value, 0), 1)
    : 1;
  const communityLostPets = canPublishCommunityPost
    ? lostPets.filter((item) => item.reporterId !== currentUser.id)
    : lostPets;
  const communityFoundPets = canPublishCommunityPost
    ? foundPets.filter((item) => item.reporterId !== currentUser.id)
    : foundPets;
  const lostFoundPlaceOptions = [
    ...new Set([
      ...communityLostPets.map((item) => item.lastSeenPlace),
      ...communityFoundPets.map((item) => item.foundPlace)
    ].filter(Boolean))
  ].sort((a, b) => a.localeCompare(b));
  const filteredCommunityLostPets = communityLostPets.filter((item) => {
    const query = lostFoundFilters.query.trim().toLowerCase();
    const searchText = [
      item.petName,
      item.petType,
      item.description,
      item.lastSeenPlace,
      item.contactName,
      item.contactPhone
    ].join(" ").toLowerCase();

    if (lostFoundFilters.postKind === "found") {
      return false;
    }

    if (query && !searchText.includes(query)) {
      return false;
    }

    if (lostFoundFilters.type !== "all" && item.petType !== lostFoundFilters.type) {
      return false;
    }

    if (lostFoundFilters.age !== "all" && !matchesAdoptionAge(item.approximateAgeInMonths ?? 0, lostFoundFilters.age)) {
      return false;
    }

    if (lostFoundFilters.place !== "all" && item.lastSeenPlace !== lostFoundFilters.place) {
      return false;
    }

    return true;
  });
  const filteredCommunityFoundPets = communityFoundPets.filter((item) => {
    const query = lostFoundFilters.query.trim().toLowerCase();
    const searchText = [
      item.petType,
      item.description,
      item.foundPlace,
      item.contactName,
      item.contactPhone
    ].join(" ").toLowerCase();

    if (lostFoundFilters.postKind === "lost" || lostFoundFilters.age !== "all") {
      return false;
    }

    if (query && !searchText.includes(query)) {
      return false;
    }

    if (lostFoundFilters.type !== "all" && item.petType !== lostFoundFilters.type) {
      return false;
    }

    if (lostFoundFilters.place !== "all" && item.foundPlace !== lostFoundFilters.place) {
      return false;
    }

    return true;
  });
  const filteredLostFoundCount = filteredCommunityLostPets.length + filteredCommunityFoundPets.length;
  const totalCommunityLostFoundCount = communityLostPets.length + communityFoundPets.length;
  const chatUnreadCount = chatConversations.reduce(
    (total, conversation) => total + (conversation.unreadIncomingCount ?? 0),
    0
  );
  const vaccineReminders = notifications.filter((item) =>
    item.title.toLowerCase().includes("vaccine") ||
    item.message.toLowerCase().includes("vaccine")
  );
  const vaccinesByPetId = vaccines.reduce((grouped, vaccine) => {
    const key = vaccine.petId;
    return {
      ...grouped,
      [key]: [...(grouped[key] ?? []), vaccine]
    };
  }, {});
  const vetPetsWithVaccines = vetPets.filter((pet) => (vaccinesByPetId[pet.id] ?? []).length > 0);
  const visibleTabs = currentUser?.role === "Admin"
    ? tabs.filter((tab) => !adminHiddenTabs.has(tab.id))
    : tabs;

  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab("overview");
    }
  }, [activeTab, visibleTabs]);

  useEffect(() => {
    const cities = Object.keys(publicPetsByCity);
    if (cities.length === 0) {
      setSelectedMapCity("");
      return;
    }

    if (!selectedMapCity || !publicPetsByCity[selectedMapCity]) {
      setSelectedMapCity(cities[0]);
    }
  }, [publicPetsByCity, selectedMapCity]);

  async function handleLogin(event) {
    event.preventDefault();
    setAuthError("");
    try {
      const user = await api.login(loginForms[selectedRole].email, loginForms[selectedRole].password);
      if (user.role !== selectedRole) {
        setAuthError(`This account is registered as ${user.role}. Please choose the ${user.role} login category.`);
        setError("");
        return;
      }
      setCurrentUser(user);
      setAuthError("");
      setError("");
    } catch (loginError) {
      setAuthError(
        friendlyErrorMessage(
          loginError,
          "Could not sign in right now. Please check your connection and try again."
        ) === "Invalid email or password."
          ? "Invalid email or password. Please check both fields and try again."
          : friendlyErrorMessage(loginError, "Could not sign in right now. Please check your connection and try again.")
      );
      setError("");
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setAuthError("");
    if (selectedRole === "Admin") {
      setAuthError("Admin accounts cannot be registered from this page.");
      setError("");
      return;
    }

    try {
      const payload = { ...registerForms[selectedRole], role: selectedRole };
      const user = await api.register(payload);
      setCurrentUser(user);
      setRegisterForms((current) => ({
        ...current,
        [selectedRole]: { ...emptyRegisterForms[selectedRole] }
      }));
      setAuthError("");
      setError("");
    } catch (registerError) {
      setAuthError(friendlyErrorMessage(registerError, "Registration failed. Please check the form and try again."));
      setError("");
    }
  }

  async function handleCreateAdoptionPost(event) {
    event.preventDefault();

    if (!currentUser?.token) {
      setError("Please sign in to publish an adoption post.");
      return;
    }

    if (!canPublishCommunityPost) {
      setError("Only User and Vet accounts can publish adoption posts.");
      return;
    }

    try {
      const payload = {
        ...adoptionPostForm,
        ageInMonths: Number(adoptionPostForm.ageInMonths || 0),
        weightKg: Number(adoptionPostForm.weightKg)
      };
      await api.createAdoptionPost(payload, currentUser.token);
      const dashboardData = await api.getDashboard();
      setDashboard(dashboardData);
      setSelectedMapCity(normalizeJordanCity(adoptionPostForm.city));

      setAdoptionPostForm(createInitialAdoptionPostForm(currentUser));
      setAdoptionNotice(t("adoption.sentNotice", "Adoption post sent successfully. It will appear after admin approval."));
      setError("");
    } catch (createError) {
      setError(createError.message || "Could not submit the adoption post.");
    }
  }

  async function handleCreateLostReport(event) {
    event.preventDefault();

    if (!currentUser?.token) {
      setError(t("lostfound.signInToPublishLost", "Please sign in to publish a lost pet report."));
      return;
    }

    if (!canPublishCommunityPost) {
      setError(t("lostfound.onlyUsersVetsPublish", "Only User and Vet accounts can publish lost or found posts."));
      return;
    }

    try {
      const payload = localizeNewLostPayload({
        ...lostPostForm,
        approximateAgeInMonths: Number(lostPostForm.approximateAgeInMonths),
        lastSeenDateUtc: new Date(lostPostForm.lastSeenDateUtc).toISOString(),
        rewardAmount: lostPostForm.rewardAmount ? Number(lostPostForm.rewardAmount) : null
      });
      const createdReport = await api.createLostPetReport(payload, currentUser.token);

      setMyLostPets((current) => [createdReport, ...current]);
      setLostPostForm(createInitialLostPostForm(currentUser));
      setLostFoundNotice(t("lostfound.sentLostNotice", "Lost pet post sent successfully. It will appear after admin approval."));
      setError("");
    } catch (createError) {
      setError(createError.message || t("lostfound.createLostFailed", "Could not submit the lost pet post."));
    }
  }

  async function handleCreateFoundReport(event) {
    event.preventDefault();

    if (!currentUser?.token) {
      setError(t("lostfound.signInToPublishFound", "Please sign in to publish a found pet report."));
      return;
    }

    if (!canPublishCommunityPost) {
      setError(t("lostfound.onlyUsersVetsPublish", "Only User and Vet accounts can publish lost or found posts."));
      return;
    }

    try {
      const payload = localizeNewFoundPayload({
        ...foundPostForm,
        foundDateUtc: new Date(foundPostForm.foundDateUtc).toISOString()
      });
      const createdReport = await api.createFoundPetReport(payload, currentUser.token);

      setMyFoundPets((current) => [createdReport, ...current]);
      setFoundPostForm(createInitialFoundPostForm(currentUser));
      setLostFoundNotice(t("lostfound.sentFoundNotice", "Found pet post sent successfully. It will appear after admin approval."));
      setError("");
    } catch (createError) {
      setError(createError.message || t("lostfound.createFoundFailed", "Could not submit the found pet post."));
    }
  }

  async function handleUploadCommunityPhoto(file, setForm, setUploading, setNotice = setLostFoundNotice) {
    if (!file) {
      return;
    }

    if (!currentUser?.token) {
      setError(t("lostfound.signInToUploadPhoto", "Please sign in first to upload a photo."));
      return;
    }

    try {
      setUploading(true);
      const uploaded = await api.uploadCommunityImage(file, currentUser.token);
      setForm((current) => ({ ...current, photoUrl: uploaded.url }));
      setNotice(t("lostfound.photoUploadedNotice", "Photo uploaded successfully. You can now submit your post."));
      setError("");
    } catch (uploadError) {
      setError(uploadError.message || t("lostfound.uploadFailed", "Could not upload this image."));
    } finally {
      setUploading(false);
    }
  }

  async function handleReviewCommunityReport(kind, id, decision) {
    if (!currentUser?.token || currentUser.role !== "Admin") {
      setError(t("lostfound.adminOnlyReview", "Only Admin accounts can review lost and found posts."));
      return;
    }

    try {
      if (kind === "lost") {
        if (decision === "approve") {
          await api.approveLostPetReport(id, currentUser.token);
        } else {
          await api.rejectLostPetReport(id, currentUser.token);
        }
        setPendingLostPets((current) => current.filter((item) => item.id !== id));
      } else {
        if (decision === "approve") {
          await api.approveFoundPetReport(id, currentUser.token);
        } else {
          await api.rejectFoundPetReport(id, currentUser.token);
        }
        setPendingFoundPets((current) => current.filter((item) => item.id !== id));
      }

      const publicReports = await Promise.all([api.getLostPets(), api.getFoundPets()]);
      setLostPets(publicReports[0]);
      setFoundPets(publicReports[1]);
      setLostFoundNotice(decision === "approve" ? t("lostfound.noticeApproved", "Post approved and published.") : t("lostfound.noticeRejected", "Post rejected."));
      setError("");
    } catch (reviewError) {
      setError(reviewError.message || t("lostfound.updateFailed", "Could not update this post."));
    }
  }

  async function handleReviewAdoptionPost(id, decision) {
    if (!currentUser?.token || currentUser.role !== "Admin") {
      setError("Only Admin accounts can review adoption posts.");
      return;
    }

    try {
      const updatedPost = decision === "approve"
        ? await api.approveAdoptionPost(id, currentUser.token)
        : await api.rejectAdoptionPost(id, currentUser.token);

      setAdminAdoptions((current) =>
        current.map((item) => (item.id === id ? updatedPost : item))
      );
      if (updatedPost.status === "Available") {
        setAdoptions((current) =>
          current.some((item) => item.id === updatedPost.id)
            ? current.map((item) => (item.id === updatedPost.id ? updatedPost : item))
            : [updatedPost, ...current]
        );
        setSelectedMapCity(normalizeJordanCity(updatedPost.city));
      } else {
        setAdoptions((current) => current.filter((item) => item.id !== id));
      }
      setAdoptionNotice(decision === "approve" ? t("adoption.approvedNotice", "Adoption post approved and published.") : t("adoption.rejectedNotice", "Adoption post rejected."));
      setError("");
    } catch (reviewError) {
      setError(reviewError.message || "Could not update this adoption post.");
    }
  }

  async function handleDeleteAdoptionPost(id, ownerId = null) {
    if (!currentUser?.token) {
      setError(t("chat.noAccess", "Please sign in first."));
      return;
    }

    const canDeletePost = currentUser.role === "Admin" || ownerId === currentUser.id;
    if (!canDeletePost) {
      setError("Only the post owner can delete this adoption post.");
      return;
    }

    try {
      if (currentUser.role === "Admin") {
        await api.deleteAdoptionPost(id, currentUser.token);
      } else {
        await api.deleteOwnAdoptionPost(id, currentUser.token);
      }
      setAdminAdoptions((current) => current.filter((item) => item.id !== id));
      setAdoptions((current) => current.filter((item) => item.id !== id));
      setAdoptionNotice(t("adoption.deletedNotice", "Adoption post deleted."));
      setError("");
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete this adoption post.");
    }
  }

  async function handleDeleteCommunityReport(kind, id) {
    if (!currentUser?.token || currentUser.role !== "Admin") {
      setError(t("lostfound.adminOnlyDelete", "Only Admin accounts can delete lost and found posts."));
      return;
    }

    try {
      if (kind === "lost") {
        await api.deleteLostPetReport(id, currentUser.token);
        setLostPets((current) => current.filter((item) => item.id !== id));
        setPendingLostPets((current) => current.filter((item) => item.id !== id));
      } else {
        await api.deleteFoundPetReport(id, currentUser.token);
        setFoundPets((current) => current.filter((item) => item.id !== id));
        setPendingFoundPets((current) => current.filter((item) => item.id !== id));
      }

      setLostFoundNotice(t("lostfound.noticeDeleted", "Post deleted."));
      setError("");
    } catch (deleteError) {
      setError(deleteError.message || t("lostfound.deleteFailed", "Could not delete this post."));
    }
  }

  async function refreshMedicalData() {
    if (!currentUser?.token) {
      return;
    }

    if (currentUser.role === "Vet") {
      const [upcomingVaccines, allPets] = await Promise.all([
        api.getUpcomingVaccines(currentUser.token),
        api.getVetMedicalPets(currentUser.token)
      ]);
      setVaccines(upcomingVaccines);
      setVetPets(allPets);
      setVaccineForm((current) => ({
        ...current,
        petId: current.petId || String(allPets[0]?.id ?? "")
      }));
      return;
    }

    if (currentUser.role === "User") {
      const [medicalPets, accountNotifications] = await Promise.all([
        api.getMyMedicalPets(currentUser.token),
        api.getNotifications(currentUser.id)
      ]);
      setUserMedicalPets(medicalPets);
      setNotifications(accountNotifications);
    }
  }

  async function handleCreateVaccination(event) {
    event.preventDefault();

    if (!currentUser?.token || currentUser.role !== "Vet") {
      setError(t("medical.onlyVetAdd", "Only Vet accounts can add vaccine plans."));
      return;
    }

    if (!vaccineForm.petId || !vaccineForm.vaccineName.trim() || !vaccineForm.dueDateUtc) {
      setError(t("medical.choosePetVaccineDate", "Choose a pet, vaccine name, and due date."));
      return;
    }

    try {
      await api.createVaccination({
        petId: Number(vaccineForm.petId),
        vaccineName: vaccineForm.vaccineName.trim(),
        dueDateUtc: new Date(`${vaccineForm.dueDateUtc}T00:00:00`).toISOString(),
        givenOnUtc: null,
        isCompleted: false
      }, currentUser.token);
      await refreshMedicalData();
      setVaccineForm((current) => ({ ...current, vaccineName: "", dueDateUtc: getDateInputValue(2) }));
      setMedicalNotice(t("medical.vaccineAddedNotice", "Vaccine date added. The owner will be notified automatically when the due date is close."));
      setError("");
    } catch (requestError) {
      setError(requestError.message || t("medical.addFailed", "Could not add this vaccine plan."));
    }
  }

  async function handleNotifyVaccineOwner(vaccineId) {
    if (!currentUser?.token || currentUser.role !== "Vet") {
      setError(t("medical.onlyVetNotify", "Only Vet accounts can notify owners."));
      return;
    }

    try {
      const notification = await api.notifyVaccineOwner(vaccineId, currentUser.token);
      await refreshMedicalData();
      setMedicalNotice(t("medical.notificationSent", "Notification sent: {message}").replace("{message}", valueLabel(notification.message)));
      setError("");
    } catch (requestError) {
      setError(requestError.message || t("medical.notifyFailed", "Could not send this notification."));
    }
  }

  async function refreshChatLists(preferredConversationId = null) {
    if (!currentUser?.token) {
      return;
    }

    const [conversations, vets] = await Promise.all([
      api.getMyChatConversations(currentUser.token),
      currentUser.role === "User" ? api.getChatVets(currentUser.token) : Promise.resolve([])
    ]);

    setChatConversations(conversations);
    setChatVets(vets);
    setSelectedConversationId((current) => {
      if (preferredConversationId && conversations.some((item) => item.id === preferredConversationId)) {
        return preferredConversationId;
      }

      if (current && conversations.some((item) => item.id === current)) {
        return current;
      }

      return conversations[0]?.id ?? null;
    });
  }

  async function handleStartChatWithVet(vetId) {
    await handleStartChatWithUser(vetId, t("chat.opened", "Chat opened successfully."));
  }

  async function handleStartChatWithUser(participantId, successMessage, openingMessage = "") {
    if (!currentUser?.token) {
      setError(t("chat.noAccess", "Please sign in first."));
      return;
    }

    if (!participantId || participantId === currentUser.id) {
      setError(t("chat.ownPost", "This post belongs to your account."));
      return;
    }

    try {
      const conversation = await api.createChatConversation(participantId, currentUser.token, openingMessage);
      await refreshChatLists(conversation.id);
      setChatNotice(successMessage);
      setError("");
      setActiveTab("chat");
    } catch (requestError) {
      setError(requestError.message || "Could not start this chat.");
    }
  }

  async function handleSendChatMessage(event) {
    event.preventDefault();

    if (!currentUser?.token || !selectedConversationId) {
      setError(t("chat.chooseFirst", "Choose a chat first."));
      return;
    }

    const text = chatMessageDraft.trim();
    if (!text) {
      return;
    }

    try {
      const message = await api.sendChatMessage(selectedConversationId, text, currentUser.token);
      setChatMessages((current) => [...current, message]);
      setChatMessageDraft("");
      setChatNotice("");
      await refreshChatLists(selectedConversationId);
      setError("");
    } catch (requestError) {
      setError(requestError.message || t("chat.sendFailed", "Could not send message."));
    }
  }

  async function handleDeleteChatConversation(conversationId) {
    if (!currentUser?.token) {
      setError(t("chat.noAccess", "Please sign in first."));
      return;
    }

    try {
      await api.deleteChatConversation(conversationId, currentUser.token);
      setChatMessages([]);
      setChatMessageDraft("");
      setChatNotice(t("chat.deleted", "Chat deleted. You can start a new one with the same account anytime."));
      await refreshChatLists();
      setError("");
    } catch (requestError) {
      setError(requestError.message || t("chat.deleteFailed", "Could not delete this chat."));
    }
  }

  function handleSignOut() {
    setCurrentUser(null);
    setActiveTab("overview");
  }

  return (
    <div className={`app-shell ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
      <aside className="sidebar">
        <div>
          <p className="eyebrow">{t("graduationProject", "Graduation Project")}</p>
          <div className="sidebar-title-row">
            <h1>PetCare Jordan</h1>
            <div className="sidebar-actions">
              <button type="button" className="top-language-toggle compact" onClick={toggleLanguage} aria-label="Switch language">
                <span>{isArabic ? "EN" : "AR"}</span>
              </button>
              {currentUser && isChatRole ? (
                <button type="button" className="chat-bell-icon-button" onClick={() => setActiveTab("chat")}>
                  <span className="chat-bell-emoji" aria-hidden="true">🔔</span>
                  <strong className="chat-bell-badge">{chatUnreadCount}</strong>
                </button>
              ) : null}
            </div>
          </div>
          <p className="sidebar-copy">
            {t("sidebarCopy", "A pet adoption, recovery, and veterinary care platform built with ASP.NET Core and React.")}
          </p>
        </div>

        <nav className="tab-list">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "tab active" : "tab"}
              onClick={() => setActiveTab(tab.id)}
            >
              {t(`tab.${tab.id}`, tab.id)}
            </button>
          ))}
        </nav>

        <div className="demo-card">
          <h3>{t("roleDemoAccounts", "Role Demo Accounts")}</h3>
          {visibleDemoRoles.map((role) => (
            <button
              key={role}
              type="button"
              className="credential-chip"
              onClick={() => {
                setSelectedRole(role);
                setIsRoleLocked(true);
                setAuthError("");
                setAuthModeByRole((current) => ({ ...current, [role]: "login" }));
                setLoginForms((current) => ({
                  ...current,
                  [role]: { email: demoCredentials[role].email, password: demoCredentials[role].password }
                }));
              }}
            >
              {roleLabels[language][role]}: {demoCredentials[role].name}
            </button>
          ))}
          {isRoleLocked ? (
            <button type="button" className="demo-switch" onClick={() => setIsRoleLocked(false)}>
              {t("showAllRoleDemos", "Show all role demos")}
            </button>
          ) : null}
        </div>
      </aside>

      <main className="main-content">
        <header className="hero">
          <div>
            <p className="eyebrow">{t("heroEyebrow", "Jordan-wide care network")}</p>
            <h2>{t("heroTitle", "Manage adoptions, lost pets, pet health history, and vaccine reminders in one place.")}</h2>
          </div>

          <AuthPanel
            t={t}
            language={language}
            currentUser={currentUser}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            isRoleLocked={isRoleLocked}
            setIsRoleLocked={setIsRoleLocked}
            authModeByRole={authModeByRole}
            setAuthModeByRole={setAuthModeByRole}
            loginForms={loginForms}
            setLoginForms={setLoginForms}
            registerForms={registerForms}
            setRegisterForms={setRegisterForms}
            authError={authError}
            setAuthError={setAuthError}
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            handleSignOut={handleSignOut}
          />
        </header>

        {error ? <div className="alert">{error}</div> : null}
        {loading ? <div className="section-card">{t("loadingProjectData", "Loading project data...")}</div> : null}

        {!loading && dashboardView ? (
          <>
            {activeTab === "overview" ? (
              <div className="content-grid">
                <SectionCard title={t("overview.analyticsTitle", "Analytics Dashboard")}>
                  <div className="stats-grid">
                    <StatCard label={t("overview.users", "Registered users")} value={dashboardView.totalUsers} accent="#0f766e" />
                    <StatCard label={t("overview.vets", "Veterinarians")} value={dashboardView.totalVets} accent="#a16207" />
                    <StatCard label={t("overview.pets", "Pets in system")} value={dashboardView.totalPets} accent="#0f172a" />
                    <StatCard label={t("overview.adoptionPets", "Pets for adoption")} value={dashboardView.petsForAdoption} accent="#c2410c" />
                    <StatCard label={t("overview.lostReports", "Active lost reports")} value={dashboardView.lostReports} accent="#be123c" />
                    <StatCard label={t("overview.upcomingVaccines", "Upcoming vaccines")} value={dashboardView.upcomingVaccines} accent="#1d4ed8" />
                  </div>
                </SectionCard>

                <SectionCard title={t("overview.animalsByType", "Public Animals By Type")} subtitle={t("overview.animalsByTypeSubtitle", "Distribution across adoption, lost, and found posts.")}>
                  <div className="bar-list">
                    {Object.entries(dashboardView.petsByType).filter(([label]) => Number.isNaN(Number(label))).map(([label, value]) => (
                      <div key={label} className="bar-row">
                        <span>{petTypeLabel(label)}</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${(value / dashboardTypeTotal) * 100}%` }} />
                        </div>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title={t("overview.mapTitle", "Interactive Public Pets Map")} subtitle={t("overview.mapSubtitle", "Click a city marker to see adoption, lost, and found animals listed there.")}>
                  <JordanPetsMap
                    petsByCity={dashboardView.petsByCity}
                    pets={publicMapPets}
                    selectedCity={selectedMapCity}
                    onSelectCity={setSelectedMapCity}
                    cityLabel={cityLabel}
                    language={language}
                  />
                </SectionCard>

                <SectionCard title={t("overview.notificationsTitle", "Owner Notifications")} subtitle={t("overview.notificationsSubtitle", "Vaccine reminders that owners receive before due dates.")}>
                  {notifications.length > 0 ? (
                    <div className="list-stack">
                      {notifications.map((item) => (
                        <article key={item.id} className="list-card">
                          <strong>{item.title}</strong>
                          <p>{item.message}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">{t("overview.signInReminders", "Sign in to see reminders for your account.")}</p>
                  )}
                </SectionCard>
              </div>
            ) : null}

            {activeTab === "adoption" && currentUser && !privateLoading ? (
              <div className="content-grid">
                {currentUser.role === "Admin" ? (
                  <>
                    <SectionCard title={t("adoption.pendingTitle", "Pending Adoption Posts")} subtitle={t("adoption.pendingSubtitle", "Approve posts to publish them, or reject posts that should stay hidden.")}>
                      <div className="list-stack">
                        {pendingAdoptions.length > 0 ? (
                          pendingAdoptions.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt={item.petName} petType={item.petType} />
                              <strong>{item.petName}</strong>
                              <p>{adoptionStoryLabel(item.story)}</p>
                              <div className="meta-line">
                                <span>{petTypeLabel(item.petType)}</span>
                                <span>{cityLabel(item.city)}</span>
                                <span>{weightLabel(item.weightKg)}</span>
                              </div>
                              <div className="meta-line">
                                <span>{contactMethodLabel(item.contactMethod)}: {item.contactDetails}</span>
                              </div>
                              <div className="form-grid-two">
                                <button type="button" className="admin-action-button" onClick={() => handleReviewAdoptionPost(item.id, "approve")}>
  {t("adoption.approve", "Approve")}
</button>
<button type="button" className="admin-action-button" onClick={() => handleReviewAdoptionPost(item.id, "reject")}>
  {t("adoption.reject", "Reject")}
</button>
                              </div>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">{t("adoption.noPending", "No pending adoption posts.")}</p>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard title={t("adoption.publishedTitle", "Published Adoption Posts")} subtitle={t("adoption.publishedSubtitle", "Approved adoption posts visible to User and Vet accounts.")}>
                      <div className="list-stack">
                        {publishedAdoptions.length > 0 ? (
                          publishedAdoptions.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt={item.petName} petType={item.petType} />
                              <strong>{item.petName}</strong>
                              <p>{adoptionStoryLabel(item.story)}</p>
                              <div className="meta-line">
                                <span>{petTypeLabel(item.petType)}</span>
                                <span>{cityLabel(item.city)}</span>
                                <span>{weightLabel(item.weightKg)}</span>
                              </div>
                              <div className="meta-line">
                                <span>{contactMethodLabel(item.contactMethod)}: {item.contactDetails}</span>
                              </div>
                              <button type="button" className="admin-action-button" onClick={() => handleDeleteAdoptionPost(item.id)}>
  {t("adoption.delete", "Delete")}
</button>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">{t("adoption.noPublished", "No published adoption posts.")}</p>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard title={t("adoption.rejectedTitle", "Rejected Adoption Posts")} subtitle={t("adoption.rejectedSubtitle", "Rejected posts stay hidden from users and vets.")}>
                      <div className="list-stack">
                        {rejectedAdoptions.length > 0 ? (
                          rejectedAdoptions.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt={item.petName} petType={item.petType} />
                              <strong>{item.petName}</strong>
                              <p>{adoptionStoryLabel(item.story)}</p>
                              <div className="meta-line">
                                <span>{petTypeLabel(item.petType)}</span>
                                <span>{cityLabel(item.city)}</span>
                              </div>
                              <button type="button" className="admin-action-button" onClick={() => handleDeleteAdoptionPost(item.id)}>
                                {t("adoption.delete", "Delete")}
                              </button>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">{t("adoption.noRejected", "No rejected adoption posts.")}</p>
                        )}
                      </div>
                    </SectionCard>
                  </>
                ) : (
                  <SectionCard title={t("adoption.createTitle", "Publish Adoption Post")} subtitle={t("adoption.createSubtitle", "User and Vet accounts can add a pet with direct owner contact.")}>
                    {canPublishCommunityPost ? (
                      <form className="post-form adoption-form" onSubmit={handleCreateAdoptionPost}>
                        <div className="form-grid-two">
                          <input
                            type="text"
                            placeholder={t("adoption.petName", "Pet name")}
                            value={adoptionPostForm.petName}
                            onChange={(event) => setAdoptionPostForm((current) => ({ ...current, petName: event.target.value }))}
                            required
                          />
                          <select
                            value={adoptionPostForm.petType}
                            onChange={(event) => setAdoptionPostForm((current) => ({ ...current, petType: event.target.value }))}
                          >
                            {petTypeOptions.map((type) => (
                              <option key={type} value={type}>
                                {petTypeLabel(type)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-grid-two">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder={t("adoption.ageMonths", "Age in months")}
                            value={adoptionPostForm.ageInMonths}
                            onChange={(event) => setAdoptionPostForm((current) => ({ ...current, ageInMonths: event.target.value }))}
                          />
                          <label className="checkbox-field">
                            <input
                              type="checkbox"
                              checked={adoptionPostForm.isNeutered}
                              onChange={(event) => setAdoptionPostForm((current) => ({ ...current, isNeutered: event.target.checked }))}
                            />
                            {t("adoption.neutered", "Neutered")}
                          </label>
                        </div>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          placeholder={t("adoption.weight", "Weight in kg")}
                          value={adoptionPostForm.weightKg}
                          onChange={(event) => setAdoptionPostForm((current) => ({ ...current, weightKg: event.target.value }))}
                          required
                        />
                        <input
                          type="text"
                          placeholder={t("adoption.city", "City")}
                          value={adoptionPostForm.city}
                          onChange={(event) => setAdoptionPostForm((current) => ({ ...current, city: event.target.value }))}
                          required
                        />
                        <input
                          type="text"
                          placeholder={t("adoption.location", "Exact location, area, or street")}
                          value={adoptionPostForm.locationDetails}
                          onChange={(event) => setAdoptionPostForm((current) => ({ ...current, locationDetails: event.target.value }))}
                          required
                        />
                        <textarea
                          placeholder={t("adoption.description", "Simple description")}
                          value={adoptionPostForm.description}
                          onChange={(event) => setAdoptionPostForm((current) => ({ ...current, description: event.target.value }))}
                          required
                        />
                        <input
                          type="url"
                          placeholder={t("adoption.photoUrl", "Photo URL (optional if you upload from device)")}
                          value={adoptionPostForm.photoUrl}
                          onChange={(event) => setAdoptionPostForm((current) => ({ ...current, photoUrl: event.target.value }))}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleUploadCommunityPhoto(
                              event.target.files?.[0],
                              setAdoptionPostForm,
                              setAdoptionPhotoUploading,
                              setAdoptionNotice
                            )
                          }
                        />
                        <p className="upload-hint">
                          {adoptionPhotoUploading
                            ? t("adoption.uploading", "Uploading image...")
                            : adoptionPostForm.photoUrl
                            ? t("adoption.imageReady", "Image is ready. You can submit the adoption post.")
                            : t("adoption.chooseImage", "Choose an image from your device, or paste a Photo URL.")}
                        </p>
                        <input
                          type="text"
                          placeholder={t("adoption.contactPhone", "Owner contact phone")}
                          value={adoptionPostForm.contactPhone}
                          onChange={(event) => setAdoptionPostForm((current) => ({ ...current, contactPhone: event.target.value }))}
                          required
                        />
                        <button type="submit">{t("adoption.submit", "Submit Adoption Post")}</button>
                      </form>
                    ) : (
                      <p className="empty-state">{t("adoption.onlyUsersVets", "Only User and Vet accounts can publish adoption posts.")}</p>
                    )}
                  </SectionCard>
                )}

                {adoptionNotice ? <p className="form-success">{adoptionNotice}</p> : null}

                {currentUser.role !== "Admin" ? (
                <SectionCard title={t("adoption.marketplaceTitle", "Adoption Marketplace")} subtitle={t("adoption.marketplaceSubtitle", "Owners can publish pets for adoption and adopters can contact them directly.")}>
                  <div className="adoption-filter-panel">
                    <div className="filter-search-row">
                      <input
                        type="search"
                        placeholder={t("adoption.searchPlaceholder", "Search by name, breed, city, or owner")}
                        value={adoptionFilters.query}
                        onChange={(event) => setAdoptionFilters((current) => ({ ...current, query: event.target.value }))}
                      />
                      <button type="button" className="filter-search-button">
                        {t("adoption.search", "Search")}
                      </button>
                    </div>
                    <div className="filter-control-grid">
                      <label>
                        {t("adoption.type", "Type")}
                        <select
                          value={adoptionFilters.type}
                          onChange={(event) => setAdoptionFilters((current) => ({ ...current, type: event.target.value }))}
                        >
                          <option value="all">{t("adoption.allTypes", "All types")}</option>
                          {petTypeOptions.map((type) => (
                            <option key={type} value={type}>
                              {petTypeLabel(type)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        {t("adoption.age", "Age")}
                        <select
                          value={adoptionFilters.age}
                          onChange={(event) => setAdoptionFilters((current) => ({ ...current, age: event.target.value }))}
                        >
                          {adoptionAgeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {adoptionAgeLabel(option.value, option.label)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        {t("adoption.health", "Health")}
                        <select
                          value={adoptionFilters.health}
                          onChange={(event) => setAdoptionFilters((current) => ({ ...current, health: event.target.value }))}
                        >
                          {adoptionHealthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {adoptionHealthLabel(option.value, option.label)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        {t("adoption.city", "City")}
                        <select
                          value={adoptionFilters.city}
                          onChange={(event) => setAdoptionFilters((current) => ({ ...current, city: event.target.value }))}
                        >
                          <option value="all">{t("adoption.allCities", "All cities")}</option>
                          {adoptionCityOptions.map((city) => (
                            <option key={city} value={city}>
                              {cityLabel(city)}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="filter-summary-row">
                      <span>{filteredAdoptions.length} {t("common.of", "of")} {adoptions.length} {t("adoption.matches", "pets match")}</span>
                      <button
                        type="button"
                        className="filter-reset-button"
                        onClick={() => setAdoptionFilters({ query: "", type: "all", age: "all", health: "all", city: "all" })}
                      >
                        {t("adoption.clearFilters", "Clear filters")}
                      </button>
                    </div>
                  </div>
                  <div className="pet-grid">
                    {filteredAdoptions.length > 0 ? (
                      filteredAdoptions.map((item) => (
                        <article key={item.id} className="pet-card">
                          {brokenAdoptionImages[item.id] ? (
                            <div className="pet-image-fallback">{t("adoption.photoUnavailable", "Photo unavailable")}</div>
                          ) : (
                            <img
                              src={item.photoUrl}
                              alt={item.petName}
                              onError={(event) => {
                                const fallbackUrl = fallbackPetPhotos[item.petType] ?? fallbackPetPhotos.Other;
                                if (event.currentTarget.src !== fallbackUrl) {
                                  event.currentTarget.src = fallbackUrl;
                                } else {
                                  setBrokenAdoptionImages((current) => ({ ...current, [item.id]: true }));
                                }
                              }}
                            />
                          )}
                          <div className="pet-card-body">
                            <div className="pet-card-head">
                              <div>
                                <h4>{item.petName}</h4>
                                <span>{petTypeLabel(item.petType)} | {petBreedLabel(item.breed)}</span>
                              </div>
                              <span className={item.status === "Available" ? "pill success" : "pill warning"}>{adoptionStatusLabel(item.status)}</span>
                            </div>
                            <p>{adoptionStoryLabel(item.story)}</p>
                            <div className="meta-line">
                              <span>{formatPetAgeLocalized(item.ageInMonths)}</span>
                              <span>{cityLabel(item.city)}</span>
                              <span>{weightLabel(item.weightKg)}</span>
                            </div>
                            <div className="meta-line">
                              <span>{item.isNeutered ? t("adoption.neutered", "Neutered") : t("adoption.notNeutered", "Not neutered")}</span>
                              <span>{locationLabel(item.locationDetails)}</span>
                            </div>
                            <div className="meta-line">
                              <span>{contactMethodLabel(item.contactMethod)}: {item.contactDetails}</span>
                            </div>
                            {item.ownerId !== currentUser.id ? (
                              <button
                                type="button"
                                className="card-primary-action"
                                onClick={() =>
                                  handleStartChatWithUser(
                                    item.ownerId,
                                    language === "ar" ? `تم فتح محادثة التبني مع ${item.ownerName}.` : `Adoption chat opened with ${item.ownerName}.`,
                                    language === "ar" ? `مرحباً ${item.ownerName}، أريد تبنّي ${item.petName}.` : `Hi ${item.ownerName}, I would like to adopt ${item.petName}.`
                                  )
                                }
                              >
                                {t("adoption.adopt", "Adopt")} {item.petName}
                              </button>
                            ) : (
                              <div className="owner-post-actions">
                                <span className="owner-note">{t("adoption.ownerPost", "This is your adoption post.")}</span>
                                <button
                                  type="button"
                                  className="icon-button danger"
                                  onClick={() => handleDeleteAdoptionPost(item.id, item.ownerId)}
                                  aria-label={language === "ar" ? `حذف منشور التبني لـ ${item.petName}` : `Delete adoption post for ${item.petName}`}
                                  title={language === "ar" ? `حذف منشور التبني لـ ${item.petName}` : `Delete adoption post for ${item.petName}`}
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            )}
                          </div>
                        </article>
                      ))
                    ) : (
                      <p className="empty-state">{adoptions.length > 0 ? t("adoption.noMatch", "No pets match these filters.") : t("adoption.noPosts", "No adoption posts yet.")}</p>
                    )}
                  </div>
                </SectionCard>
                ) : null}
              </div>
            ) : null}

            {activeTab === "lostfound" && currentUser && !privateLoading ? (
              <div className="content-grid">
                {currentUser.role === "Admin" ? (
                  <>
                    <SectionCard
                      title={t("lostfound.pendingLostTitle", "Pending Lost Pet Posts")}
                      subtitle={t("lostfound.pendingLostSubtitle", "Approve posts to publish them, or reject posts that should stay hidden.")}
                    >
                      <div className="list-stack">
                        {pendingLostPets.length > 0 ? (
                          pendingLostPets.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt="" petType={item.petType} />
                              <strong>{item.petName}</strong>
                              <p>{valueLabel(item.description)}</p>
                              <div className="meta-line">
                                <span>{petTypeLabel(item.petType)}</span>
                                <span>{locationLabel(item.lastSeenPlace)}</span>
                                <span>{new Date(item.lastSeenDateUtc).toLocaleDateString()}</span>
                              </div>
                              <div className="meta-line">
                                <span>{t("lostfound.contact", "Contact")}: {valueLabel(item.contactName)}</span>
                                <span>{item.contactPhone}</span>
                              </div>
                              <div className="form-grid-two">
                                <button type="button" className="admin-action-button" onClick={() => handleReviewCommunityReport("lost", item.id, "approve")}>
                                  {t("lostfound.approve", "Approve")}
                                </button>
                                <button type="button" className="admin-action-button" onClick={() => handleReviewCommunityReport("lost", item.id, "reject")}>
                                  {t("lostfound.reject", "Reject")}
                                </button>
                              </div>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">{t("lostfound.noPendingLost", "No pending lost pet posts.")}</p>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard
                      title={t("lostfound.pendingFoundTitle", "Pending Found Pet Posts")}
                      subtitle={t("lostfound.pendingFoundSubtitle", "Found pet reports also stay hidden until admin approval.")}
                    >
                      <div className="list-stack">
                        {pendingFoundPets.length > 0 ? (
                          pendingFoundPets.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt="" petType={item.petType} />
                              <strong>{petTypeLabel(item.petType)}</strong>
                              <p>{valueLabel(item.description)}</p>
                              <div className="meta-line">
                                <span>{locationLabel(item.foundPlace)}</span>
                                <span>{new Date(item.foundDateUtc).toLocaleDateString()}</span>
                              </div>
                              <div className="meta-line">
                                <span>{t("lostfound.contact", "Contact")}: {valueLabel(item.contactName)}</span>
                                <span>{item.contactPhone}</span>
                              </div>
                              <div className="form-grid-two">
                                <button type="button" className="admin-action-button" onClick={() => handleReviewCommunityReport("found", item.id, "approve")}>
                                  {t("lostfound.approve", "Approve")}
                                </button>
                                <button type="button" className="admin-action-button" onClick={() => handleReviewCommunityReport("found", item.id, "reject")}>
                                  {t("lostfound.reject", "Reject")}
                                </button>
                              </div>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">{t("lostfound.noPendingFound", "No pending found pet posts.")}</p>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard
                      title={t("lostfound.publishedLostTitle", "Published Lost Pet Posts")}
                      subtitle={t("lostfound.publishedLostSubtitle", "Already approved posts visible to User and Vet accounts.")}
                    >
                      <div className="list-stack">
                        {lostPets.length > 0 ? (
                          lostPets.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt="" petType={item.petType} />
                              <strong>{item.petName}</strong>
                              <p>{valueLabel(item.description)}</p>
                              <div className="meta-line">
                                <span>{petTypeLabel(item.petType)}</span>
                                <span>{locationLabel(item.lastSeenPlace)}</span>
                                <span>{new Date(item.lastSeenDateUtc).toLocaleDateString()}</span>
                              </div>
                              <div className="meta-line">
                                <span>{t("lostfound.contact", "Contact")}: {valueLabel(item.contactName)}</span>
                                <span>{item.contactPhone}</span>
                              </div>
                              <button type="button" className="admin-action-button" onClick={() => handleDeleteCommunityReport("lost", item.id)}>
                                {t("lostfound.delete", "Delete")}
                              </button>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">{t("lostfound.noPublishedLost", "No published lost pet posts.")}</p>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard
                      title={t("lostfound.publishedFoundTitle", "Published Found Pet Posts")}
                      subtitle={t("lostfound.publishedFoundSubtitle", "Remove found pet posts that should no longer appear publicly.")}
                    >
                      <div className="list-stack">
                        {foundPets.length > 0 ? (
                          foundPets.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt="" petType={item.petType} />
                              <strong>{petTypeLabel(item.petType)}</strong>
                              <p>{valueLabel(item.description)}</p>
                              <div className="meta-line">
                                <span>{locationLabel(item.foundPlace)}</span>
                                <span>{new Date(item.foundDateUtc).toLocaleDateString()}</span>
                              </div>
                              <div className="meta-line">
                                <span>{t("lostfound.contact", "Contact")}: {valueLabel(item.contactName)}</span>
                                <span>{item.contactPhone}</span>
                              </div>
                              <button type="button" className="admin-action-button" onClick={() => handleDeleteCommunityReport("found", item.id)}>
                                {t("lostfound.delete", "Delete")}
                              </button>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">{t("lostfound.noPublishedFound", "No published found pet posts.")}</p>
                        )}
                      </div>
                    </SectionCard>
                  </>
                ) : (
                  <>
                    <SectionCard
                      title={t("lostfound.myPostsTitle", "My Posts")}
                      subtitle={t("lostfound.myPostsSubtitle", "Your lost and found reports stay here, separate from other people's posts.")}
                    >
                      <div className="content-grid two-column">
                        <div className="list-stack">
                          <strong>{t("lostfound.myLostReports", "My Lost Reports")}</strong>
                          {myLostPets.length > 0 ? (
                            myLostPets.map((item) => (
                              <article key={item.id} className="list-card">
                                <PostPhoto src={item.photoUrl} alt="" petType={item.petType} />
                                <strong>{item.petName}</strong>
                                <p>{valueLabel(item.description)}</p>
                                <div className="meta-line">
                                  <span>{locationLabel(item.lastSeenPlace)}</span>
                                  <span>{new Date(item.lastSeenDateUtc).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-line">
                                  <span className="pill warning">{lostFoundStatusLabel(item.status)}</span>
                                  <span>{t("lostfound.reward", "Reward")}: {lostFoundRewardLabel(item.rewardAmount)}</span>
                                </div>
                              </article>
                            ))
                          ) : (
                            <p className="empty-state">{t("lostfound.noMyLost", "You have not submitted lost pet reports yet.")}</p>
                          )}
                        </div>

                        <div className="list-stack">
                          <strong>{t("lostfound.myFoundReports", "My Found Reports")}</strong>
                          {myFoundPets.length > 0 ? (
                            myFoundPets.map((item) => (
                              <article key={item.id} className="list-card">
                                <PostPhoto src={item.photoUrl} alt="" petType={item.petType} />
                                <strong>{petTypeLabel(item.petType)}</strong>
                                <p>{valueLabel(item.description)}</p>
                                <div className="meta-line">
                                  <span>{locationLabel(item.foundPlace)}</span>
                                  <span>{new Date(item.foundDateUtc).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-line">
                                  <span className="pill warning">{lostFoundStatusLabel(item.status)}</span>
                                  <span>{item.contactPhone}</span>
                                </div>
                              </article>
                            ))
                          ) : (
                            <p className="empty-state">{t("lostfound.noMyFound", "You have not submitted found pet reports yet.")}</p>
                          )}
                        </div>
                      </div>
                    </SectionCard>

                    <SectionCard
                      title={t("lostfound.searchTitle", "Search Lost / Found Posts")}
                      subtitle={t("lostfound.searchSubtitle", "Filter community reports by animal type, post kind, age, or place.")}
                    >
                      <div className="adoption-filter-panel">
                        <div className="filter-search-row">
                          <input
                            type="search"
                            placeholder={t("lostfound.searchPlaceholder", "Search by pet name, description, place, or contact")}
                            value={lostFoundFilters.query}
                            onChange={(event) => setLostFoundFilters((current) => ({ ...current, query: event.target.value }))}
                          />
                          <button type="button" className="filter-search-button">
                            {t("lostfound.searchButton", "Search")}
                          </button>
                        </div>
                        <div className="filter-control-grid">
                          <label>
                            {t("lostfound.post", "Post")}
                            <select
                              value={lostFoundFilters.postKind}
                              onChange={(event) => setLostFoundFilters((current) => ({ ...current, postKind: event.target.value }))}
                            >
                              <option value="all">{t("lostfound.lostAndFound", "Lost and found")}</option>
                              <option value="lost">{t("lostfound.lostOnly", "Lost only")}</option>
                              <option value="found">{t("lostfound.foundOnly", "Found only")}</option>
                            </select>
                          </label>
                          <label>
                            {t("lostfound.type", "Type")}
                            <select
                              value={lostFoundFilters.type}
                              onChange={(event) => setLostFoundFilters((current) => ({ ...current, type: event.target.value }))}
                            >
                              <option value="all">{t("lostfound.allTypes", "All types")}</option>
                              {petTypeOptions.map((type) => (
                                <option key={type} value={type}>
                                  {petTypeLabel(type)}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            {t("lostfound.age", "Age")}
                            <select
                              value={lostFoundFilters.age}
                              onChange={(event) => setLostFoundFilters((current) => ({ ...current, age: event.target.value }))}
                            >
                              {adoptionAgeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {lostFoundAgeLabel(option.value, option.label)}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            {t("lostfound.place", "Place")}
                            <select
                              value={lostFoundFilters.place}
                              onChange={(event) => setLostFoundFilters((current) => ({ ...current, place: event.target.value }))}
                            >
                              <option value="all">{t("lostfound.allPlaces", "All places")}</option>
                              {lostFoundPlaceOptions.map((place) => (
                                <option key={place} value={place}>
                                  {locationLabel(place)}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div className="filter-summary-row">
                          <span>{filteredLostFoundCount} {t("common.of", "of")} {totalCommunityLostFoundCount} {t("lostfound.reportsMatch", "reports match")}</span>
                          <button
                            type="button"
                            className="filter-reset-button"
                            onClick={() => setLostFoundFilters({ query: "", type: "all", postKind: "all", age: "all", place: "all" })}
                          >
                            {t("lostfound.clearFilters", "Clear filters")}
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    <div className="content-grid two-column">
                      <SectionCard
                        title={t("lostfound.communityLostTitle", "Community Lost Pets")}
                        subtitle={t("lostfound.communityLostSubtitle", "Approved missing-pet posts from other accounts.")}
                      >
                        <div className="list-stack">
                          {filteredCommunityLostPets.length > 0 ? (
                            filteredCommunityLostPets.map((item) => (
                              <article key={item.id} className="list-card">
                                <PostPhoto src={item.photoUrl} alt="" petType={item.petType} />
                                <strong>{item.petName}</strong>
                                <p>{valueLabel(item.description)}</p>
                                <div className="meta-line">
                                  <span>{locationLabel(item.lastSeenPlace)}</span>
                                  <span>{new Date(item.lastSeenDateUtc).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-line">
                                  <span>{t("lostfound.reward", "Reward")}: {lostFoundRewardLabel(item.rewardAmount)}</span>
                                  <span>{item.contactPhone}</span>
                                </div>
                                {item.reporterId ? (
                                  <button
                                    type="button"
                                    className="card-primary-action"
                                    onClick={() =>
                                      handleStartChatWithUser(
                                        item.reporterId,
                                        lostFoundMessageOpened(item.contactName),
                                        lostFoundLostOpeningMessage(item.contactName, item.petName)
                                      )
                                    }
                                  >
                                    {t("lostfound.messageOwner", "Message Owner")}
                                  </button>
                                ) : null}
                              </article>
                            ))
                          ) : (
                            <p className="empty-state">
                              {communityLostPets.length > 0
                                ? t("lostfound.noLostMatches", "No lost pet posts match these filters.")
                                : t("lostfound.noLostPosts", "No approved lost pet posts from other accounts.")}
                            </p>
                          )}
                        </div>
                      </SectionCard>

                      <SectionCard
                        title={t("lostfound.communityFoundTitle", "Community Found Pets")}
                        subtitle={t("lostfound.communityFoundSubtitle", "Approved found-pet posts from other accounts.")}
                      >
                        <div className="list-stack">
                          {filteredCommunityFoundPets.length > 0 ? (
                            filteredCommunityFoundPets.map((item) => (
                              <article key={item.id} className="list-card">
                                <PostPhoto src={item.photoUrl} alt="" petType={item.petType} />
                                <strong>{petTypeLabel(item.petType)}</strong>
                                <p>{valueLabel(item.description)}</p>
                                <div className="meta-line">
                                  <span>{locationLabel(item.foundPlace)}</span>
                                  <span>{new Date(item.foundDateUtc).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-line">
                                  <span>{t("lostfound.contact", "Contact")}: {valueLabel(item.contactName)}</span>
                                  <span>{item.contactPhone}</span>
                                </div>
                                {item.reporterId ? (
                                  <button
                                    type="button"
                                    className="card-primary-action"
                                    onClick={() =>
                                      handleStartChatWithUser(
                                        item.reporterId,
                                        lostFoundMessageOpened(item.contactName),
                                        lostFoundFoundOpeningMessage(item.contactName, item.petType)
                                      )
                                    }
                                  >
                                    {t("lostfound.messageFinder", "Message Finder")}
                                  </button>
                                ) : null}
                              </article>
                            ))
                          ) : (
                            <p className="empty-state">
                              {communityFoundPets.length > 0
                                ? t("lostfound.noFoundMatches", "No found pet posts match these filters.")
                                : t("lostfound.noFoundPosts", "No approved found pet posts from other accounts.")}
                            </p>
                          )}
                        </div>
                      </SectionCard>
                    </div>

                    <SectionCard
                      title={t("lostfound.publishTitle", "Publish Lost / Found Report")}
                      subtitle={t("lostfound.publishSubtitle", "Your post is saved as Pending and appears publicly only after admin approval.")}
                    >
                      {canPublishCommunityPost ? (
                        <div className="post-forms">
                          <form className="post-form" onSubmit={handleCreateLostReport}>
                            <h4>{t("lostfound.reportLostTitle", "Report Lost Pet")}</h4>
                            <div className="form-grid-two">
                              <input
                                type="text"
                                placeholder={t("lostfound.petName", "Pet name")}
                                value={lostPostForm.petName}
                                onChange={(event) => setLostPostForm((current) => ({ ...current, petName: event.target.value }))}
                                required
                              />
                              <select
                                value={lostPostForm.petType}
                                onChange={(event) => setLostPostForm((current) => ({ ...current, petType: event.target.value }))}
                              >
                                {petTypeOptions.map((type) => (
                                  <option key={type} value={type}>
                                    {petTypeLabel(type)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <textarea
                              placeholder={t("lostfound.description", "Description")}
                              value={lostPostForm.description}
                              onChange={(event) => setLostPostForm((current) => ({ ...current, description: event.target.value }))}
                              required
                            />
                            <div className="form-grid-two">
                              <input
                                type="number"
                                min="0"
                                placeholder={t("lostfound.approximateAge", "Approximate age (months)")}
                                value={lostPostForm.approximateAgeInMonths}
                                onChange={(event) =>
                                  setLostPostForm((current) => ({ ...current, approximateAgeInMonths: event.target.value }))
                                }
                                required
                              />
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder={t("lostfound.rewardAmount", "Reward amount (optional)")}
                                value={lostPostForm.rewardAmount}
                                onChange={(event) => setLostPostForm((current) => ({ ...current, rewardAmount: event.target.value }))}
                              />
                            </div>
                            <input
                              type="text"
                              placeholder={t("lostfound.lastSeenPlace", "Last seen place")}
                              value={lostPostForm.lastSeenPlace}
                              onChange={(event) => setLostPostForm((current) => ({ ...current, lastSeenPlace: event.target.value }))}
                              required
                            />
                            <label>
                              {t("lostfound.lastSeenDate", "Last seen date")}
                              <input
                                type="datetime-local"
                                value={lostPostForm.lastSeenDateUtc}
                                onChange={(event) => setLostPostForm((current) => ({ ...current, lastSeenDateUtc: event.target.value }))}
                                required
                              />
                            </label>
                            <input
                              type="url"
                              placeholder={t("lostfound.photoUrl", "Photo URL")}
                              value={lostPostForm.photoUrl}
                              onChange={(event) => setLostPostForm((current) => ({ ...current, photoUrl: event.target.value }))}
                              required
                            />
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={(event) =>
                                handleUploadCommunityPhoto(event.target.files?.[0], setLostPostForm, setLostPhotoUploading)
                              }
                            />
                            <p className="upload-hint">
                              {lostPhotoUploading
                                ? t("lostfound.uploadingImage", "Uploading image...")
                                : lostPostForm.photoUrl
                                ? t("lostfound.imageReady", "Image is ready. You can submit your report.")
                                : t("lostfound.chooseImage", "You can paste a Photo URL or upload directly from your device.")}
                            </p>
                            <div className="form-grid-two">
                              <input
                                type="text"
                                placeholder={t("lostfound.contactName", "Contact name")}
                                value={lostPostForm.contactName}
                                onChange={(event) => setLostPostForm((current) => ({ ...current, contactName: event.target.value }))}
                                required
                              />
                              <input
                                type="text"
                                placeholder={t("lostfound.contactPhone", "Contact phone")}
                                value={lostPostForm.contactPhone}
                                onChange={(event) => setLostPostForm((current) => ({ ...current, contactPhone: event.target.value }))}
                                required
                              />
                            </div>
                            <button type="submit">{t("lostfound.submitLost", "Submit Lost Report")}</button>
                          </form>

                          <form className="post-form" onSubmit={handleCreateFoundReport}>
                            <h4>{t("lostfound.reportFoundTitle", "Report Found Pet")}</h4>
                            <select
                              value={foundPostForm.petType}
                              onChange={(event) => setFoundPostForm((current) => ({ ...current, petType: event.target.value }))}
                            >
                              {petTypeOptions.map((type) => (
                                <option key={type} value={type}>
                                  {petTypeLabel(type)}
                                </option>
                              ))}
                            </select>
                            <textarea
                              placeholder={t("lostfound.description", "Description")}
                              value={foundPostForm.description}
                              onChange={(event) => setFoundPostForm((current) => ({ ...current, description: event.target.value }))}
                              required
                            />
                            <input
                              type="text"
                              placeholder={t("lostfound.foundPlace", "Found place")}
                              value={foundPostForm.foundPlace}
                              onChange={(event) => setFoundPostForm((current) => ({ ...current, foundPlace: event.target.value }))}
                              required
                            />
                            <label>
                              {t("lostfound.foundDate", "Found date")}
                              <input
                                type="datetime-local"
                                value={foundPostForm.foundDateUtc}
                                onChange={(event) => setFoundPostForm((current) => ({ ...current, foundDateUtc: event.target.value }))}
                                required
                              />
                            </label>
                            <input
                              type="url"
                              placeholder={t("lostfound.photoUrl", "Photo URL")}
                              value={foundPostForm.photoUrl}
                              onChange={(event) => setFoundPostForm((current) => ({ ...current, photoUrl: event.target.value }))}
                              required
                            />
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={(event) =>
                                handleUploadCommunityPhoto(event.target.files?.[0], setFoundPostForm, setFoundPhotoUploading)
                              }
                            />
                            <p className="upload-hint">
                              {foundPhotoUploading
                                ? t("lostfound.uploadingImage", "Uploading image...")
                                : foundPostForm.photoUrl
                                ? t("lostfound.imageReady", "Image is ready. You can submit your report.")
                                : t("lostfound.chooseImage", "You can paste a Photo URL or upload directly from your device.")}
                            </p>
                            <div className="form-grid-two">
                              <input
                                type="text"
                                placeholder={t("lostfound.contactName", "Contact name")}
                                value={foundPostForm.contactName}
                                onChange={(event) => setFoundPostForm((current) => ({ ...current, contactName: event.target.value }))}
                                required
                              />
                              <input
                                type="text"
                                placeholder={t("lostfound.contactPhone", "Contact phone")}
                                value={foundPostForm.contactPhone}
                                onChange={(event) => setFoundPostForm((current) => ({ ...current, contactPhone: event.target.value }))}
                                required
                              />
                            </div>
                            <button type="submit">{t("lostfound.submitFound", "Submit Found Report")}</button>
                          </form>
                        </div>
                      ) : (
                        <p className="empty-state">{t("lostfound.onlyUsersVets", "Only User and Vet accounts can publish lost or found reports.")}</p>
                      )}
                    </SectionCard>
                  </>
                )}

                {lostFoundNotice ? <p className="form-success">{lostFoundNotice}</p> : null}
              </div>
            ) : null}

            {activeTab === "chat" && currentUser && !privateLoading ? (
              <SectionCard
                title={t("chat.title", "Vet Chat")}
                subtitle={t("chat.subtitle", "Choose a vet and start a real conversation. Vets can reply from their own accounts.")}
              >
                {currentUser.role === "User" || currentUser.role === "Vet" ? (
                  <div className="chat-layout">
                    <aside className="chat-sidebar">
                      {currentUser.role === "User" ? (
                        <div className="chat-start-card">
                          <strong>{t("chat.startNew", "Start new chat")}</strong>
                          {vetsWithoutConversation.length > 0 ? (
                            <div className="chat-vet-list">
                              {vetsWithoutConversation.map((vet) => (
                                <button key={vet.id} type="button" onClick={() => handleStartChatWithVet(vet.id)}>
                                  <span>{vet.fullName}</span>
                                  <small>{cityLabel(vet.city)}</small>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="empty-state">{t("chat.allVetsStarted", "You already started chats with all available vets.")}</p>
                          )}
                        </div>
                      ) : null}

                      <div className="chat-start-card">
                        <strong>{currentUser.role === "User" ? t("chat.myChats", "My chats") : t("chat.userChats", "User chats")}</strong>
                        {chatConversations.length > 0 ? (
                          <div className="chat-vet-list">
                            {chatConversations.map((conversation) => (
                              <div
                                key={conversation.id}
                                className={selectedConversationId === conversation.id ? "chat-conversation-row active" : "chat-conversation-row"}
                              >
                                <button
                                  type="button"
                                  className="chat-conversation-open"
                                  onClick={() => setSelectedConversationId(conversation.id)}
                                >
                                  <div className="chat-conversation-head">
                                    <span>{conversation.counterpartName}</span>
                                    {conversation.unreadIncomingCount > 0 ? (
                                      <strong className="chat-unread-pill">{conversation.unreadIncomingCount}</strong>
                                    ) : null}
                                  </div>
                                  <small>{conversation.lastMessage ? valueLabel(conversation.lastMessage) : t("chat.noMessagesYet", "No messages yet.")}</small>
                                </button>
                                <button
                                  type="button"
                                  className="icon-button danger"
                                  onClick={() => handleDeleteChatConversation(conversation.id)}
                                  aria-label={t("chat.deleteWith", "Delete chat with {name}").replace("{name}", conversation.counterpartName)}
                                  title={t("chat.deleteWith", "Delete chat with {name}").replace("{name}", conversation.counterpartName)}
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="empty-state">{t("chat.noChats", "No chats yet.")}</p>
                        )}
                      </div>
                    </aside>

                    <section className="chat-thread">
                      {selectedConversation ? (
                        <>
                          <div className="chat-thread-head">
                            <div>
                              <strong>{selectedConversation.counterpartName}</strong>
                              <span>
                                {selectedConversation.counterpartRole === "Vet" ? t("chat.veterinarian", "Veterinarian") : t("chat.petOwner", "Pet Owner")}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="icon-button danger"
                              onClick={() => handleDeleteChatConversation(selectedConversation.id)}
                              aria-label={t("chat.deleteWith", "Delete chat with {name}").replace("{name}", selectedConversation.counterpartName)}
                              title={t("chat.deleteWith", "Delete chat with {name}").replace("{name}", selectedConversation.counterpartName)}
                            >
                              <TrashIcon />
                            </button>
                          </div>

                          <div className="chat-messages-list">
                            {chatLoading ? <p className="empty-state">{t("chat.loadingMessages", "Loading messages...")}</p> : null}
                            {!chatLoading && chatMessages.length === 0 ? (
                              <p className="empty-state">{t("chat.noThreadMessages", "No messages yet. Start the conversation now.")}</p>
                            ) : null}
                            {chatMessages.map((message) => (
                              <article
                                key={message.id}
                                className={message.senderId === currentUser.id ? "chat-message own" : "chat-message"}
                              >
                                <div className="chat-message-meta">
                                  <strong>{message.senderName}</strong>
                                  <span>{formatJordanDateTime(message.sentAtUtc)}</span>
                                </div>
                                <p>{valueLabel(message.message)}</p>
                              </article>
                            ))}
                          </div>

                          <form className="chat-compose" onSubmit={handleSendChatMessage}>
                            <textarea
                              placeholder={t("chat.messagePlaceholder", "Write your private message")}
                              value={chatMessageDraft}
                              onChange={(event) => setChatMessageDraft(event.target.value)}
                            />
                            <button type="submit">{t("chat.send", "Send")}</button>
                          </form>
                        </>
                      ) : (
                        <p className="empty-state">{t("chat.chooseChat", "Choose a chat from the left side to start messaging.")}</p>
                      )}
                    </section>
                  </div>
                ) : (
                  <p className="empty-state">{t("chat.onlyUsersVets", "Chat is available for User and Vet accounts only.")}</p>
                )}

                {chatNotice ? <p className="form-success">{chatNotice}</p> : null}
              </SectionCard>
            ) : null}

            {activeTab === "medical" && currentUser && !privateLoading ? (
              currentUser.role === "User" ? (
                <>
                  <SectionCard
                    title={t("medical.userTitle", "My Pets Medical Status")}
                    subtitle={t("medical.userSubtitle", "Only your pets are shown here with health updates and vaccine plans.")}
                  >
                    {userMedicalPets.length > 0 ? (
                      <div className="user-medical-grid">
                        {userMedicalPets.map((pet) => (
                          <article key={pet.petId} className="medical-pet-card">
                            <div className="medical-pet-head">
                              <div>
                                <h4>{pet.petName}</h4>
                                <span>{petTypeLabel(pet.petType)} | {petBreedLabel(pet.breed)}</span>
                              </div>
                              <span className={pet.isVaccinesUpToDate ? "pill success" : "pill warning"}>
                                {pet.isVaccinesUpToDate ? t("medical.upToDate", "Vaccines Up To Date") : `${pet.pendingVaccinesCount} ${t("medical.vaccinesNeeded", "Vaccine(s) Needed")}`}
                              </span>
                            </div>
                            <p className="pet-id-line">{t("medical.petId", "Pet ID")}: {pet.collarId}</p>

                            <p className={pet.isVaccinesUpToDate ? "health-summary-card stable" : "health-summary-card attention"}>
                              {valueLabel(pet.healthSummary)}
                            </p>

                            <div className="medical-subsection">
                              <div className="medical-subsection-title">
                                <strong>{t("medical.vaccinePlan", "Vaccine Plan")}</strong>
                              </div>
                              {pet.vaccinePlan.length > 0 ? (
                                <div className="list-stack">
                                  {pet.vaccinePlan.map((vaccine) => (
                                    <article key={vaccine.id} className={vaccine.isCompleted ? "list-card medical-mini-card done" : "list-card medical-mini-card due"}>
                                      <strong>{valueLabel(vaccine.vaccineName)}</strong>
                                      <div className="meta-line">
                                        <span>{t("medical.status", "Status")}: {valueLabel(vaccine.status)}</span>
                                        <span>{t("medical.due", "Due")}: {new Date(vaccine.dueDateUtc).toLocaleDateString()}</span>
                                      </div>
                                    </article>
                                  ))}
                                </div>
                              ) : (
                                <p className="empty-state">{t("medical.noVaccines", "No vaccine records available yet.")}</p>
                              )}
                            </div>

                            <div className="medical-subsection">
                              <div className="medical-subsection-title">
                                <strong>{t("medical.recentVisits", "Recent Medical Visits")}</strong>
                              </div>
                              {pet.medicalHistory.length > 0 ? (
                                <div className="list-stack">
                                  {pet.medicalHistory.slice(0, 3).map((record) => (
                                    <article key={record.id} className="list-card medical-mini-card visit">
                                      <strong>{valueLabel(record.visitReason)}</strong>
                                      <p>{valueLabel(record.diagnosis)}</p>
                                      <div className="meta-line">
                                        <span>{record.vetName}</span>
                                        <span>{new Date(record.visitDateUtc).toLocaleDateString()}</span>
                                      </div>
                                    </article>
                                  ))}
                                </div>
                              ) : (
                                <p className="empty-state">{t("medical.noVisits", "No medical visits recorded for this pet yet.")}</p>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-state">{t("medical.noLinkedPets", "No pets are linked to your account yet.")}</p>
                    )}
                  </SectionCard>

                  <SectionCard title={t("medical.vaccineReminders", "Vaccine Reminders")} subtitle={t("medical.vaccineRemindersSubtitle", "Active reminders sent by your vet for your pets.")}>
                    {vaccineReminders.length > 0 ? (
                      <div className="list-stack">
                        {vaccineReminders.map((item) => (
                          <article key={item.id} className="list-card">
                            <strong>{valueLabel(item.title)}</strong>
                            <p>{valueLabel(item.message)}</p>
                            <div className="meta-line">
                              <span>{formatJordanDateTime(item.triggerDateUtc)}</span>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-state">{t("medical.noActiveReminders", "No active vaccine reminders right now.")}</p>
                    )}
                  </SectionCard>
                </>
              ) : (
                <div className="content-grid two-column">
                  <SectionCard title={t("medical.addTitle", "Add Vaccine Date")} subtitle={t("medical.addSubtitle", "Create a vaccine date for a pet. The owner is notified automatically when the due date is close.")}>
                    <form className="post-form" onSubmit={handleCreateVaccination}>
                      <label>
                        {t("medical.pet", "Pet")}
                        <select
                          value={vaccineForm.petId}
                          onChange={(event) => setVaccineForm((current) => ({ ...current, petId: event.target.value }))}
                        >
                          {vetPets.map((pet) => (
                            <option key={pet.id} value={pet.id}>
                              {pet.name} | {pet.collarId} | {pet.ownerName}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="form-grid-two">
                        <label>
                          {t("medical.vaccineName", "Vaccine name")}
                          <input
                            value={vaccineForm.vaccineName}
                            onChange={(event) => setVaccineForm((current) => ({ ...current, vaccineName: event.target.value }))}
                            placeholder={t("medical.rabiesPlaceholder", "Rabies vaccine")}
                          />
                        </label>
                        <label>
                          {t("medical.dueDate", "Due date")}
                          <input
                            type="date"
                            value={vaccineForm.dueDateUtc}
                            onChange={(event) => setVaccineForm((current) => ({ ...current, dueDateUtc: event.target.value }))}
                          />
                        </label>
                      </div>
                      <button type="submit">{t("medical.addVaccine", "Add Vaccine")}</button>
                    </form>
                    {medicalNotice ? <p className="form-success">{medicalNotice}</p> : null}
                  </SectionCard>

                  <SectionCard title={t("medical.monitorTitle", "Pet Vaccine Monitor")} subtitle={t("medical.monitorSubtitle", "Each pet has its own card with owner details and active vaccine reminders.")}>
                    {vetPetsWithVaccines.length > 0 ? (
                      <div className="user-medical-grid">
                        {vetPetsWithVaccines.map((pet) => {
                          const petVaccines = vaccinesByPetId[pet.id] ?? [];

                          return (
                            <article key={pet.id} className="medical-pet-card">
                              <div className="medical-pet-head">
                                <div>
                                  <h4>{pet.name}</h4>
                                  <span>{petTypeLabel(pet.type)} | {petBreedLabel(pet.breed)}</span>
                                </div>
                                <span className={petVaccines.length > 0 ? "pill warning" : "pill success"}>
                                  {petVaccines.length > 0 ? `${petVaccines.length} ${t("medical.upcoming", "Upcoming")}` : t("medical.noActiveReminder", "No Active Reminder")}
                                </span>
                              </div>
                              <p className="pet-id-line">{t("medical.petId", "Pet ID")}: {pet.collarId}</p>
                              <div className="meta-line">
                                <span>{t("medical.owner", "Owner")}: {pet.ownerName}</span>
                                <span>{cityLabel(pet.city)}</span>
                              </div>

                              <div className="medical-subsection">
                                <strong>{t("medical.activeNeeds", "Active Vaccine Needs")}</strong>
                                <div className="list-stack">
                                  {petVaccines.map((vaccine) => (
                                    <article key={vaccine.id} className="list-card">
                                      <strong>{valueLabel(vaccine.vaccineName)}</strong>
                                      <div className="meta-line">
                                        <span>{t("medical.due", "Due")}: {new Date(vaccine.dueDateUtc).toLocaleDateString()}</span>
                                        <span>{vaccine.ownerPhone}</span>
                                      </div>
                                      <span className={vaccine.isNotified ? "pill success" : "pill warning"}>
                                        {vaccine.isNotified ? t("medical.notified", "Notified") : t("medical.notNotified", "Not notified")}
                                      </span>
                                    </article>
                                  ))}
                                </div>
                              </div>

                            </article>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="empty-state">{t("medical.noPetsMonitor", "No pets are available to monitor yet.")}</p>
                    )}
                  </SectionCard>

                  <SectionCard title={t("medical.upcomingTitle", "Upcoming Vaccines")} subtitle={t("medical.upcomingSubtitle", "Due-soon vaccines notify owners automatically and disappear after their due date passes.")}>
                    <div className="list-stack">
                      {vaccines.length > 0 ? (
                        vaccines.map((item) => (
                          <article key={item.id} className="list-card">
                            <strong>{item.petName}</strong>
                            <p>{valueLabel(item.vaccineName)}</p>
                            <div className="meta-line">
                              <span>{t("medical.owner", "Owner")}: {item.ownerName}</span>
                              <span>{t("medical.due", "Due")}: {new Date(item.dueDateUtc).toLocaleDateString()}</span>
                            </div>
                            <div className="meta-line">
                              <span>{t("medical.petId", "Pet ID")}: {item.petCollarId}</span>
                              <span>{item.ownerPhone}</span>
                            </div>
                            {item.isNotified ? (
                              <span className="pill success">{t("medical.notified", "Notified")}</span>
                            ) : (
                              <button type="button" className="card-primary-action" onClick={() => handleNotifyVaccineOwner(item.id)}>
                                {t("medical.notify", "Notify")}
                              </button>
                            )}
                          </article>
                        ))
                      ) : (
                        <p className="empty-state">{t("medical.noUpcoming", "No vaccine plans are due in the next 30 days.")}</p>
                      )}
                    </div>
                  </SectionCard>

                  <SectionCard title={t("medical.roleStoryTitle", "Vet Role Story")} subtitle={t("medical.roleStorySubtitle", "How the medical workflow works in this project.")}>
                    <div className="feature-list">
                      <div>
                        <strong>{t("medical.createHistoryTitle", "Create medical history")}</strong>
                        <p>{t("medical.createHistoryText", "Veterinarians can create visit notes, diagnoses, and treatment records for each pet.")}</p>
                      </div>
                      <div>
                        <strong>{t("medical.updateRecordsTitle", "Update records")}</strong>
                        <p>{t("medical.updateRecordsText", "Vets can edit existing medical entries as treatment plans change over time.")}</p>
                      </div>
                      <div>
                        <strong>{t("medical.trackVaccinesTitle", "Track vaccines")}</strong>
                        <p>{t("medical.trackVaccinesText", "The backend identifies vaccines due in the next 30 days and surfaces reminders for owners.")}</p>
                      </div>
                      <div>
                        <strong>{t("medical.searchCollarTitle", "Search by collar ID")}</strong>
                        <p>{t("medical.searchCollarText", "Each pet can be found quickly through its unique collar ID to access ownership and health information.")}</p>
                      </div>
                    </div>
                  </SectionCard>
                </div>
              )
            ) : null}

            {activeTab !== "overview" && !currentUser ? (
              <SectionCard
                title={t("common.loginRequired", "Login Required")}
                subtitle={t("common.loginRequiredSubtitle", "Please sign in first,This section is visible only after signing in")}
              />
            ) : null}

            {activeTab !== "overview" && currentUser && privateLoading ? (
              <div className="section-card">{t("common.loadingAccount", "Loading your account data...")}</div>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  );
}

export default App;

