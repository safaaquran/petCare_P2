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
    "common.loginRequired": "تسجيل الدخول مطلوب",
    "common.loginRequiredSubtitle": "يرجى تسجيل الدخول أولاً، هذا القسم يظهر بعد تسجيل الدخول."
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

function formatPetAge(ageInMonths = 0) {
  if (ageInMonths <= 0) {
    return "Age not listed";
  }

  if (ageInMonths < 12) {
    return `${ageInMonths} month${ageInMonths === 1 ? "" : "s"}`;
  }

  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;
  return months > 0
    ? `${years} yr ${months} mo`
    : `${years} year${years === 1 ? "" : "s"}`;
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

function JordanPetsMap({ petsByCity, pets, selectedCity, onSelectCity }) {
  const entries = Object.entries(petsByCity);
  const maxPets = Math.max(...entries.map(([, value]) => value), 1);
  const mappedCities = entries.filter(([city]) => jordanCityPositions[city]);
  const activeCity = selectedCity && petsByCity[selectedCity] ? selectedCity : mappedCities[0]?.[0] ?? "";
  const selectedPets = pets.filter((pet) => pet.city === activeCity);
  const mapQuery = jordanMapQuery(selectedPets[0]?.locationDetails || activeCity);

  return (
    <div className="jordan-map-layout interactive">
      <div className="jordan-map-panel" aria-label="Jordan pets by city map">
        <img className="jordan-map-template" src="/jordan-map-template.jfif" alt="Jordan map outline" />

        {mappedCities.map(([city, value]) => {
          const position = jordanCityPositions[city];
          const markerSize = 26 + (value / maxPets) * 10;
          return (
            <button
              key={city}
              type="button"
              className={city === activeCity ? "map-city-pin active" : "map-city-pin"}
              onClick={() => onSelectCity(city)}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                "--pin-size": `${markerSize}px`
              }}
              title={`${city}: ${value} pets`}
            >
              <span className="map-pin-head">
                <strong>{value}</strong>
              </span>
              <span>{city}</span>
            </button>
          );
        })}
      </div>

      <aside className="map-details-panel">
        <div className="map-details-head">
          <div>
            <span>Selected city</span>
            <strong>{activeCity || "No city selected"}</strong>
          </div>
          <span className="pill success">{selectedPets.length} pets</span>
        </div>

        <div className="map-pet-list">
          <iframe
            className="google-map-preview"
            title={`${activeCity} pets map`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
            loading="lazy"
          />

          {selectedPets.length > 0 ? (
            selectedPets.map((pet) => (
              <article key={pet.id} className="map-pet-card">
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  onError={(event) => { event.currentTarget.src = fallbackPetPhotos[pet.type] ?? fallbackPetPhotos.Other; }}
                />
                <div>
                  <strong>{pet.name}</strong>
                  <span>{pet.source} | {pet.type} | {pet.breed}</span>
                  <p>{pet.locationDetails || pet.city}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(jordanMapQuery(pet.locationDetails || pet.city))}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">Choose a city marker to see its pets and exact locations.</p>
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
      setAdoptionNotice("Adoption post sent successfully. It will appear after admin approval.");
      setError("");
    } catch (createError) {
      setError(createError.message || "Could not submit the adoption post.");
    }
  }

  async function handleCreateLostReport(event) {
    event.preventDefault();

    if (!currentUser?.token) {
      setError("Please sign in to publish a lost pet report.");
      return;
    }

    if (!canPublishCommunityPost) {
      setError("Only User and Vet accounts can publish lost or found posts.");
      return;
    }

    try {
      const payload = {
        ...lostPostForm,
        approximateAgeInMonths: Number(lostPostForm.approximateAgeInMonths),
        lastSeenDateUtc: new Date(lostPostForm.lastSeenDateUtc).toISOString(),
        rewardAmount: lostPostForm.rewardAmount ? Number(lostPostForm.rewardAmount) : null
      };
      const createdReport = await api.createLostPetReport(payload, currentUser.token);

      setMyLostPets((current) => [createdReport, ...current]);
      setLostPostForm(createInitialLostPostForm(currentUser));
      setLostFoundNotice("Lost pet post sent successfully. It will appear after admin approval.");
      setError("");
    } catch (createError) {
      setError(createError.message || "Could not submit the lost pet post.");
    }
  }

  async function handleCreateFoundReport(event) {
    event.preventDefault();

    if (!currentUser?.token) {
      setError("Please sign in to publish a found pet report.");
      return;
    }

    if (!canPublishCommunityPost) {
      setError("Only User and Vet accounts can publish lost or found posts.");
      return;
    }

    try {
      const payload = {
        ...foundPostForm,
        foundDateUtc: new Date(foundPostForm.foundDateUtc).toISOString()
      };
      const createdReport = await api.createFoundPetReport(payload, currentUser.token);

      setMyFoundPets((current) => [createdReport, ...current]);
      setFoundPostForm(createInitialFoundPostForm(currentUser));
      setLostFoundNotice("Found pet post sent successfully. It will appear after admin approval.");
      setError("");
    } catch (createError) {
      setError(createError.message || "Could not submit the found pet post.");
    }
  }

  async function handleUploadCommunityPhoto(file, setForm, setUploading, setNotice = setLostFoundNotice) {
    if (!file) {
      return;
    }

    if (!currentUser?.token) {
      setError("Please sign in first to upload a photo.");
      return;
    }

    try {
      setUploading(true);
      const uploaded = await api.uploadCommunityImage(file, currentUser.token);
      setForm((current) => ({ ...current, photoUrl: uploaded.url }));
      setNotice("Photo uploaded successfully. You can now submit your post.");
      setError("");
    } catch (uploadError) {
      setError(uploadError.message || "Could not upload this image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleReviewCommunityReport(kind, id, decision) {
    if (!currentUser?.token || currentUser.role !== "Admin") {
      setError("Only Admin accounts can review lost and found posts.");
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
      setLostFoundNotice(decision === "approve" ? "Post approved and published." : "Post rejected.");
      setError("");
    } catch (reviewError) {
      setError(reviewError.message || "Could not update this post.");
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
      setAdoptionNotice(decision === "approve" ? "Adoption post approved and published." : "Adoption post rejected.");
      setError("");
    } catch (reviewError) {
      setError(reviewError.message || "Could not update this adoption post.");
    }
  }

  async function handleDeleteAdoptionPost(id, ownerId = null) {
    if (!currentUser?.token) {
      setError("Please sign in first.");
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
      setAdoptionNotice("Adoption post deleted.");
      setError("");
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete this adoption post.");
    }
  }

  async function handleDeleteCommunityReport(kind, id) {
    if (!currentUser?.token || currentUser.role !== "Admin") {
      setError("Only Admin accounts can delete lost and found posts.");
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

      setLostFoundNotice("Post deleted.");
      setError("");
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete this post.");
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
      setError("Only Vet accounts can add vaccine plans.");
      return;
    }

    if (!vaccineForm.petId || !vaccineForm.vaccineName.trim() || !vaccineForm.dueDateUtc) {
      setError("Choose a pet, vaccine name, and due date.");
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
      setMedicalNotice("Vaccine date added. The owner will be notified automatically when the due date is close.");
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Could not add this vaccine plan.");
    }
  }

  async function handleNotifyVaccineOwner(vaccineId) {
    if (!currentUser?.token || currentUser.role !== "Vet") {
      setError("Only Vet accounts can notify owners.");
      return;
    }

    try {
      const notification = await api.notifyVaccineOwner(vaccineId, currentUser.token);
      await refreshMedicalData();
      setMedicalNotice(`Notification sent: ${notification.message}`);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Could not send this notification.");
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
    await handleStartChatWithUser(vetId, "Chat opened successfully.");
  }

  async function handleStartChatWithUser(participantId, successMessage, openingMessage = "") {
    if (!currentUser?.token) {
      setError("Please sign in first.");
      return;
    }

    if (!participantId || participantId === currentUser.id) {
      setError("This post belongs to your account.");
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
      setError("Choose a chat first.");
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
      setError(requestError.message || "Could not send message.");
    }
  }

  async function handleDeleteChatConversation(conversationId) {
    if (!currentUser?.token) {
      setError("Please sign in first.");
      return;
    }

    try {
      await api.deleteChatConversation(conversationId, currentUser.token);
      setChatMessages([]);
      setChatMessageDraft("");
      setChatNotice("Chat deleted. You can start a new one with the same account anytime.");
      await refreshChatLists();
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Could not delete this chat.");
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
                        <span>{label}</span>
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
                    <SectionCard title="Pending Adoption Posts" subtitle="Approve posts to publish them, or reject posts that should stay hidden.">
                      <div className="list-stack">
                        {pendingAdoptions.length > 0 ? (
                          pendingAdoptions.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt={item.petName} petType={item.petType} />
                              <strong>{item.petName}</strong>
                              <p>{item.story}</p>
                              <div className="meta-line">
                                <span>{item.petType}</span>
                                <span>{item.city}</span>
                                <span>{item.weightKg} kg</span>
                              </div>
                              <div className="meta-line">
                                <span>{item.contactMethod}: {item.contactDetails}</span>
                              </div>
                              <div className="form-grid-two">
                                <button type="button" className="admin-action-button" onClick={() => handleReviewAdoptionPost(item.id, "approve")}>
                                  Approve
                                </button>
                                <button type="button" className="admin-action-button" onClick={() => handleReviewAdoptionPost(item.id, "reject")}>
                                  Reject
                                </button>
                              </div>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">No pending adoption posts.</p>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard title="Published Adoption Posts" subtitle="Approved adoption posts visible to User and Vet accounts.">
                      <div className="list-stack">
                        {publishedAdoptions.length > 0 ? (
                          publishedAdoptions.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt={item.petName} petType={item.petType} />
                              <strong>{item.petName}</strong>
                              <p>{item.story}</p>
                              <div className="meta-line">
                                <span>{item.petType}</span>
                                <span>{item.city}</span>
                                <span>{item.weightKg} kg</span>
                              </div>
                              <div className="meta-line">
                                <span>{item.contactMethod}: {item.contactDetails}</span>
                              </div>
                              <button type="button" className="admin-action-button" onClick={() => handleDeleteAdoptionPost(item.id)}>
                                Delete
                              </button>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">No published adoption posts.</p>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard title="Rejected Adoption Posts" subtitle="Rejected posts stay hidden from users and vets.">
                      <div className="list-stack">
                        {rejectedAdoptions.length > 0 ? (
                          rejectedAdoptions.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt={item.petName} petType={item.petType} />
                              <strong>{item.petName}</strong>
                              <p>{item.story}</p>
                              <div className="meta-line">
                                <span>{item.petType}</span>
                                <span>{item.city}</span>
                              </div>
                              <button type="button" className="admin-action-button" onClick={() => handleDeleteAdoptionPost(item.id)}>
                                Delete
                              </button>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">No rejected adoption posts.</p>
                        )}
                      </div>
                    </SectionCard>
                  </>
                ) : (
                  <SectionCard title="Publish Adoption Post" subtitle="User and Vet accounts can add a pet with direct owner contact.">
                    {canPublishCommunityPost ? (
                      <form className="post-form adoption-form" onSubmit={handleCreateAdoptionPost}>
                        <div className="form-grid-two">
                          <input
                            type="text"
                            placeholder="Pet name"
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
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-grid-two">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="Age in months"
                            value={adoptionPostForm.ageInMonths}
                            onChange={(event) => setAdoptionPostForm((current) => ({ ...current, ageInMonths: event.target.value }))}
                          />
                          <label className="checkbox-field">
                            <input
                              type="checkbox"
                              checked={adoptionPostForm.isNeutered}
                              onChange={(event) => setAdoptionPostForm((current) => ({ ...current, isNeutered: event.target.checked }))}
                            />
                            Neutered
                          </label>
                        </div>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          placeholder="Weight in kg"
                          value={adoptionPostForm.weightKg}
                          onChange={(event) => setAdoptionPostForm((current) => ({ ...current, weightKg: event.target.value }))}
                          required
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={adoptionPostForm.city}
                          onChange={(event) => setAdoptionPostForm((current) => ({ ...current, city: event.target.value }))}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Exact location, area, or street"
                          value={adoptionPostForm.locationDetails}
                          onChange={(event) => setAdoptionPostForm((current) => ({ ...current, locationDetails: event.target.value }))}
                          required
                        />
                        <textarea
                          placeholder="Simple description"
                          value={adoptionPostForm.description}
                          onChange={(event) => setAdoptionPostForm((current) => ({ ...current, description: event.target.value }))}
                          required
                        />
                        <input
                          type="url"
                          placeholder="Photo URL (optional if you upload from device)"
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
                            ? "Uploading image..."
                            : adoptionPostForm.photoUrl
                            ? "Image is ready. You can submit the adoption post."
                            : "Choose an image from your device, or paste a Photo URL."}
                        </p>
                        <input
                          type="text"
                          placeholder="Owner contact phone"
                          value={adoptionPostForm.contactPhone}
                          onChange={(event) => setAdoptionPostForm((current) => ({ ...current, contactPhone: event.target.value }))}
                          required
                        />
                        <button type="submit">Submit Adoption Post</button>
                      </form>
                    ) : (
                      <p className="empty-state">Only User and Vet accounts can publish adoption posts.</p>
                    )}
                  </SectionCard>
                )}

                {adoptionNotice ? <p className="form-success">{adoptionNotice}</p> : null}

                {currentUser.role !== "Admin" ? (
                <SectionCard title="Adoption Marketplace" subtitle="Owners can publish pets for adoption and adopters can contact them directly.">
                  <div className="adoption-filter-panel">
                    <div className="filter-search-row">
                      <input
                        type="search"
                        placeholder="Search by name, breed, city, or owner"
                        value={adoptionFilters.query}
                        onChange={(event) => setAdoptionFilters((current) => ({ ...current, query: event.target.value }))}
                      />
                      <button type="button" className="filter-search-button">
                        Search
                      </button>
                    </div>
                    <div className="filter-control-grid">
                      <label>
                        Type
                        <select
                          value={adoptionFilters.type}
                          onChange={(event) => setAdoptionFilters((current) => ({ ...current, type: event.target.value }))}
                        >
                          <option value="all">All types</option>
                          {petTypeOptions.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Age
                        <select
                          value={adoptionFilters.age}
                          onChange={(event) => setAdoptionFilters((current) => ({ ...current, age: event.target.value }))}
                        >
                          {adoptionAgeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Health
                        <select
                          value={adoptionFilters.health}
                          onChange={(event) => setAdoptionFilters((current) => ({ ...current, health: event.target.value }))}
                        >
                          {adoptionHealthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        City
                        <select
                          value={adoptionFilters.city}
                          onChange={(event) => setAdoptionFilters((current) => ({ ...current, city: event.target.value }))}
                        >
                          <option value="all">All cities</option>
                          {adoptionCityOptions.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="filter-summary-row">
                      <span>{filteredAdoptions.length} of {adoptions.length} pets match</span>
                      <button
                        type="button"
                        className="filter-reset-button"
                        onClick={() => setAdoptionFilters({ query: "", type: "all", age: "all", health: "all", city: "all" })}
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                  <div className="pet-grid">
                    {filteredAdoptions.length > 0 ? (
                      filteredAdoptions.map((item) => (
                        <article key={item.id} className="pet-card">
                          {brokenAdoptionImages[item.id] ? (
                            <div className="pet-image-fallback">Photo unavailable</div>
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
                                <span>{item.petType} | {item.breed}</span>
                              </div>
                              <span className={item.status === "Available" ? "pill success" : "pill warning"}>{item.status}</span>
                            </div>
                            <p>{item.story}</p>
                            <div className="meta-line">
                              <span>{formatPetAge(item.ageInMonths)}</span>
                              <span>{item.city}</span>
                              <span>{item.weightKg} kg</span>
                            </div>
                            <div className="meta-line">
                              <span>{item.isNeutered ? "Neutered" : "Not neutered"}</span>
                              <span>{item.locationDetails}</span>
                            </div>
                            <div className="meta-line">
                              <span>{item.contactMethod}: {item.contactDetails}</span>
                            </div>
                            {item.ownerId !== currentUser.id ? (
                              <button
                                type="button"
                                className="card-primary-action"
                                onClick={() =>
                                  handleStartChatWithUser(
                                    item.ownerId,
                                    `Adoption chat opened with ${item.ownerName}.`,
                                    `Hi ${item.ownerName}, I would like to adopt ${item.petName}.`
                                  )
                                }
                              >
                                Adopt {item.petName}
                              </button>
                            ) : (
                              <div className="owner-post-actions">
                                <span className="owner-note">This is your adoption post.</span>
                                <button
                                  type="button"
                                  className="icon-button danger"
                                  onClick={() => handleDeleteAdoptionPost(item.id, item.ownerId)}
                                  aria-label={`Delete adoption post for ${item.petName}`}
                                  title={`Delete adoption post for ${item.petName}`}
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            )}
                          </div>
                        </article>
                      ))
                    ) : (
                      <p className="empty-state">{adoptions.length > 0 ? "No pets match these filters." : "No adoption posts yet."}</p>
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
                    <SectionCard title="Pending Lost Pet Posts" subtitle="Approve posts to publish them, or reject posts that should stay hidden.">
                      <div className="list-stack">
                        {pendingLostPets.length > 0 ? (
                          pendingLostPets.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt={item.petName} petType={item.petType} />
                              <strong>{item.petName}</strong>
                              <p>{item.description}</p>
                              <div className="meta-line">
                                <span>{item.petType}</span>
                                <span>{item.lastSeenPlace}</span>
                                <span>{new Date(item.lastSeenDateUtc).toLocaleDateString()}</span>
                              </div>
                              <div className="meta-line">
                                <span>Contact: {item.contactName}</span>
                                <span>{item.contactPhone}</span>
                              </div>
                              <div className="form-grid-two">
                                <button type="button" className="admin-action-button" onClick={() => handleReviewCommunityReport("lost", item.id, "approve")}>
                                  Approve
                                </button>
                                <button type="button" className="admin-action-button" onClick={() => handleReviewCommunityReport("lost", item.id, "reject")}>
                                  Reject
                                </button>
                              </div>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">No pending lost pet posts.</p>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard title="Pending Found Pet Posts" subtitle="Found pet reports also stay hidden until admin approval.">
                      <div className="list-stack">
                        {pendingFoundPets.length > 0 ? (
                          pendingFoundPets.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt={`Found ${item.petType}`} petType={item.petType} />
                              <strong>{item.petType}</strong>
                              <p>{item.description}</p>
                              <div className="meta-line">
                                <span>{item.foundPlace}</span>
                                <span>{new Date(item.foundDateUtc).toLocaleDateString()}</span>
                              </div>
                              <div className="meta-line">
                                <span>Contact: {item.contactName}</span>
                                <span>{item.contactPhone}</span>
                              </div>
                              <div className="form-grid-two">
                                <button type="button" className="admin-action-button" onClick={() => handleReviewCommunityReport("found", item.id, "approve")}>
                                  Approve
                                </button>
                                <button type="button" className="admin-action-button" onClick={() => handleReviewCommunityReport("found", item.id, "reject")}>
                                  Reject
                                </button>
                              </div>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">No pending found pet posts.</p>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard title="Published Lost Pet Posts" subtitle="Already approved posts visible to User and Vet accounts.">
                      <div className="list-stack">
                        {lostPets.length > 0 ? (
                          lostPets.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt={item.petName} petType={item.petType} />
                              <strong>{item.petName}</strong>
                              <p>{item.description}</p>
                              <div className="meta-line">
                                <span>{item.petType}</span>
                                <span>{item.lastSeenPlace}</span>
                                <span>{new Date(item.lastSeenDateUtc).toLocaleDateString()}</span>
                              </div>
                              <div className="meta-line">
                                <span>Contact: {item.contactName}</span>
                                <span>{item.contactPhone}</span>
                              </div>
                              <button type="button" className="admin-action-button" onClick={() => handleDeleteCommunityReport("lost", item.id)}>
                                Delete
                              </button>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">No published lost pet posts.</p>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard title="Published Found Pet Posts" subtitle="Remove found pet posts that should no longer appear publicly.">
                      <div className="list-stack">
                        {foundPets.length > 0 ? (
                          foundPets.map((item) => (
                            <article key={item.id} className="list-card">
                              <PostPhoto src={item.photoUrl} alt={`Found ${item.petType}`} petType={item.petType} />
                              <strong>{item.petType}</strong>
                              <p>{item.description}</p>
                              <div className="meta-line">
                                <span>{item.foundPlace}</span>
                                <span>{new Date(item.foundDateUtc).toLocaleDateString()}</span>
                              </div>
                              <div className="meta-line">
                                <span>Contact: {item.contactName}</span>
                                <span>{item.contactPhone}</span>
                              </div>
                              <button type="button" className="admin-action-button" onClick={() => handleDeleteCommunityReport("found", item.id)}>
                                Delete
                              </button>
                            </article>
                          ))
                        ) : (
                          <p className="empty-state">No published found pet posts.</p>
                        )}
                      </div>
                    </SectionCard>
                  </>
                ) : (
                  <>
                    <SectionCard title="My Posts" subtitle="Your lost and found reports stay here, separate from other people's posts.">
                      <div className="content-grid two-column">
                        <div className="list-stack">
                          <strong>My Lost Reports</strong>
                          {myLostPets.length > 0 ? (
                            myLostPets.map((item) => (
                              <article key={item.id} className="list-card">
                                <PostPhoto src={item.photoUrl} alt={item.petName} petType={item.petType} />
                                <strong>{item.petName}</strong>
                                <p>{item.description}</p>
                                <div className="meta-line">
                                  <span>{item.lastSeenPlace}</span>
                                  <span>{new Date(item.lastSeenDateUtc).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-line">
                                  <span className="pill warning">{item.status}</span>
                                  <span>Reward: {item.rewardAmount ? `${item.rewardAmount} JOD` : "No reward listed"}</span>
                                </div>
                              </article>
                            ))
                          ) : (
                            <p className="empty-state">You have not submitted lost pet reports yet.</p>
                          )}
                        </div>

                        <div className="list-stack">
                          <strong>My Found Reports</strong>
                          {myFoundPets.length > 0 ? (
                            myFoundPets.map((item) => (
                              <article key={item.id} className="list-card">
                                <PostPhoto src={item.photoUrl} alt={`Found ${item.petType}`} petType={item.petType} />
                                <strong>{item.petType}</strong>
                                <p>{item.description}</p>
                                <div className="meta-line">
                                  <span>{item.foundPlace}</span>
                                  <span>{new Date(item.foundDateUtc).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-line">
                                  <span className="pill warning">{item.status}</span>
                                  <span>{item.contactPhone}</span>
                                </div>
                              </article>
                            ))
                          ) : (
                            <p className="empty-state">You have not submitted found pet reports yet.</p>
                          )}
                        </div>
                      </div>
                    </SectionCard>

                    <SectionCard title="Search Lost / Found Posts" subtitle="Filter community reports by animal type, post kind, age, or place.">
                      <div className="adoption-filter-panel">
                        <div className="filter-search-row">
                          <input
                            type="search"
                            placeholder="Search by pet name, description, place, or contact"
                            value={lostFoundFilters.query}
                            onChange={(event) => setLostFoundFilters((current) => ({ ...current, query: event.target.value }))}
                          />
                          <button type="button" className="filter-search-button">
                            Search
                          </button>
                        </div>
                        <div className="filter-control-grid">
                          <label>
                            Post
                            <select
                              value={lostFoundFilters.postKind}
                              onChange={(event) => setLostFoundFilters((current) => ({ ...current, postKind: event.target.value }))}
                            >
                              <option value="all">Lost and found</option>
                              <option value="lost">Lost only</option>
                              <option value="found">Found only</option>
                            </select>
                          </label>
                          <label>
                            Type
                            <select
                              value={lostFoundFilters.type}
                              onChange={(event) => setLostFoundFilters((current) => ({ ...current, type: event.target.value }))}
                            >
                              <option value="all">All types</option>
                              {petTypeOptions.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Age
                            <select
                              value={lostFoundFilters.age}
                              onChange={(event) => setLostFoundFilters((current) => ({ ...current, age: event.target.value }))}
                            >
                              {adoptionAgeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Place
                            <select
                              value={lostFoundFilters.place}
                              onChange={(event) => setLostFoundFilters((current) => ({ ...current, place: event.target.value }))}
                            >
                              <option value="all">All places</option>
                              {lostFoundPlaceOptions.map((place) => (
                                <option key={place} value={place}>
                                  {place}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div className="filter-summary-row">
                          <span>{filteredLostFoundCount} of {totalCommunityLostFoundCount} reports match</span>
                          <button
                            type="button"
                            className="filter-reset-button"
                            onClick={() => setLostFoundFilters({ query: "", type: "all", postKind: "all", age: "all", place: "all" })}
                          >
                            Clear filters
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    <div className="content-grid two-column">
                      <SectionCard title="Community Lost Pets" subtitle="Approved missing-pet posts from other accounts.">
                        <div className="list-stack">
                          {filteredCommunityLostPets.length > 0 ? (
                            filteredCommunityLostPets.map((item) => (
                              <article key={item.id} className="list-card">
                                <PostPhoto src={item.photoUrl} alt={item.petName} petType={item.petType} />
                                <strong>{item.petName}</strong>
                                <p>{item.description}</p>
                                <div className="meta-line">
                                  <span>{item.lastSeenPlace}</span>
                                  <span>{new Date(item.lastSeenDateUtc).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-line">
                                  <span>Reward: {item.rewardAmount ? `${item.rewardAmount} JOD` : "No reward listed"}</span>
                                  <span>{item.contactPhone}</span>
                                </div>
                                {item.reporterId ? (
                                  <button
                                    type="button"
                                    className="card-primary-action"
                                    onClick={() =>
                                      handleStartChatWithUser(
                                        item.reporterId,
                                        `Message opened with ${item.contactName}.`,
                                        `Hi ${item.contactName}, I saw your lost pet post for ${item.petName}. I may have information that can help.`
                                      )
                                    }
                                  >
                                    Message Owner
                                  </button>
                                ) : null}
                              </article>
                            ))
                          ) : (
                            <p className="empty-state">{communityLostPets.length > 0 ? "No lost pet posts match these filters." : "No approved lost pet posts from other accounts."}</p>
                          )}
                        </div>
                      </SectionCard>

                      <SectionCard title="Community Found Pets" subtitle="Approved found-pet posts from other accounts.">
                        <div className="list-stack">
                          {filteredCommunityFoundPets.length > 0 ? (
                            filteredCommunityFoundPets.map((item) => (
                              <article key={item.id} className="list-card">
                                <PostPhoto src={item.photoUrl} alt={`Found ${item.petType}`} petType={item.petType} />
                                <strong>{item.petType}</strong>
                                <p>{item.description}</p>
                                <div className="meta-line">
                                  <span>{item.foundPlace}</span>
                                  <span>{new Date(item.foundDateUtc).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-line">
                                  <span>Contact: {item.contactName}</span>
                                  <span>{item.contactPhone}</span>
                                </div>
                                {item.reporterId ? (
                                  <button
                                    type="button"
                                    className="card-primary-action"
                                    onClick={() =>
                                      handleStartChatWithUser(
                                        item.reporterId,
                                        `Message opened with ${item.contactName}.`,
                                        `Hi ${item.contactName}, I saw your found ${item.petType} report and want to check if it matches my pet.`
                                      )
                                    }
                                  >
                                    Message Finder
                                  </button>
                                ) : null}
                              </article>
                            ))
                          ) : (
                            <p className="empty-state">{communityFoundPets.length > 0 ? "No found pet posts match these filters." : "No approved found pet posts from other accounts."}</p>
                          )}
                        </div>
                      </SectionCard>
                    </div>

                    <SectionCard title="Publish Lost / Found Report" subtitle="Your post is saved as Pending and appears publicly only after admin approval.">
                      {canPublishCommunityPost ? (
                        <div className="post-forms">
                      <form className="post-form" onSubmit={handleCreateLostReport}>
                        <h4>Report Lost Pet</h4>
                        <div className="form-grid-two">
                          <input
                            type="text"
                            placeholder="Pet name"
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
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <textarea
                          placeholder="Description"
                          value={lostPostForm.description}
                          onChange={(event) => setLostPostForm((current) => ({ ...current, description: event.target.value }))}
                          required
                        />
                        <div className="form-grid-two">
                          <input
                            type="number"
                            min="0"
                            placeholder="Approximate age (months)"
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
                            placeholder="Reward amount (optional)"
                            value={lostPostForm.rewardAmount}
                            onChange={(event) => setLostPostForm((current) => ({ ...current, rewardAmount: event.target.value }))}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Last seen place"
                          value={lostPostForm.lastSeenPlace}
                          onChange={(event) => setLostPostForm((current) => ({ ...current, lastSeenPlace: event.target.value }))}
                          required
                        />
                        <input
                          type="datetime-local"
                          value={lostPostForm.lastSeenDateUtc}
                          onChange={(event) => setLostPostForm((current) => ({ ...current, lastSeenDateUtc: event.target.value }))}
                          required
                        />
                        <input
                          type="url"
                          placeholder="Photo URL"
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
                            ? "Uploading image..."
                            : "You can paste a Photo URL or upload directly from your device."}
                        </p>
                        <div className="form-grid-two">
                          <input
                            type="text"
                            placeholder="Contact name"
                            value={lostPostForm.contactName}
                            onChange={(event) => setLostPostForm((current) => ({ ...current, contactName: event.target.value }))}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Contact phone"
                            value={lostPostForm.contactPhone}
                            onChange={(event) => setLostPostForm((current) => ({ ...current, contactPhone: event.target.value }))}
                            required
                          />
                        </div>
                        <button type="submit">Submit Lost Report</button>
                      </form>

                      <form className="post-form" onSubmit={handleCreateFoundReport}>
                        <h4>Report Found Pet</h4>
                        <select
                          value={foundPostForm.petType}
                          onChange={(event) => setFoundPostForm((current) => ({ ...current, petType: event.target.value }))}
                        >
                          {petTypeOptions.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <textarea
                          placeholder="Description"
                          value={foundPostForm.description}
                          onChange={(event) => setFoundPostForm((current) => ({ ...current, description: event.target.value }))}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Found place"
                          value={foundPostForm.foundPlace}
                          onChange={(event) => setFoundPostForm((current) => ({ ...current, foundPlace: event.target.value }))}
                          required
                        />
                        <input
                          type="datetime-local"
                          value={foundPostForm.foundDateUtc}
                          onChange={(event) => setFoundPostForm((current) => ({ ...current, foundDateUtc: event.target.value }))}
                          required
                        />
                        <input
                          type="url"
                          placeholder="Photo URL"
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
                            ? "Uploading image..."
                            : "You can paste a Photo URL or upload directly from your device."}
                        </p>
                        <div className="form-grid-two">
                          <input
                            type="text"
                            placeholder="Contact name"
                            value={foundPostForm.contactName}
                            onChange={(event) => setFoundPostForm((current) => ({ ...current, contactName: event.target.value }))}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Contact phone"
                            value={foundPostForm.contactPhone}
                            onChange={(event) => setFoundPostForm((current) => ({ ...current, contactPhone: event.target.value }))}
                            required
                          />
                        </div>
                        <button type="submit">Submit Found Report</button>
                      </form>
                        </div>
                      ) : (
                        <p className="empty-state">Only User and Vet accounts can publish lost or found reports.</p>
                      )}
                    </SectionCard>
                  </>
                )}

                {lostFoundNotice ? <p className="form-success">{lostFoundNotice}</p> : null}
              </div>
            ) : null}

            {activeTab === "chat" && currentUser && !privateLoading ? (
              <SectionCard
                title="Vet Chat"
                subtitle="Choose a vet and start a real conversation. Vets can reply from their own accounts."
              >
                {currentUser.role === "User" || currentUser.role === "Vet" ? (
                  <div className="chat-layout">
                    <aside className="chat-sidebar">
                      {currentUser.role === "User" ? (
                        <div className="chat-start-card">
                          <strong>Start new chat</strong>
                          {vetsWithoutConversation.length > 0 ? (
                            <div className="chat-vet-list">
                              {vetsWithoutConversation.map((vet) => (
                                <button key={vet.id} type="button" onClick={() => handleStartChatWithVet(vet.id)}>
                                  <span>{vet.fullName}</span>
                                  <small>{vet.city}</small>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="empty-state">You already started chats with all available vets.</p>
                          )}
                        </div>
                      ) : null}

                      <div className="chat-start-card">
                        <strong>{currentUser.role === "User" ? "My chats" : "User chats"}</strong>
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
                                  <small>{conversation.lastMessage || "No messages yet."}</small>
                                </button>
                                <button
                                  type="button"
                                  className="icon-button danger"
                                  onClick={() => handleDeleteChatConversation(conversation.id)}
                                  aria-label={`Delete chat with ${conversation.counterpartName}`}
                                  title={`Delete chat with ${conversation.counterpartName}`}
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="empty-state">No chats yet.</p>
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
                                {selectedConversation.counterpartRole === "Vet" ? "Veterinarian" : "Pet Owner"}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="icon-button danger"
                              onClick={() => handleDeleteChatConversation(selectedConversation.id)}
                              aria-label={`Delete chat with ${selectedConversation.counterpartName}`}
                              title={`Delete chat with ${selectedConversation.counterpartName}`}
                            >
                              <TrashIcon />
                            </button>
                          </div>

                          <div className="chat-messages-list">
                            {chatLoading ? <p className="empty-state">Loading messages...</p> : null}
                            {!chatLoading && chatMessages.length === 0 ? (
                              <p className="empty-state">No messages yet. Start the conversation now.</p>
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
                                <p>{message.message}</p>
                              </article>
                            ))}
                          </div>

                          <form className="chat-compose" onSubmit={handleSendChatMessage}>
                            <textarea
                              placeholder="اكتب رسالتك الخاصة"
                              value={chatMessageDraft}
                              onChange={(event) => setChatMessageDraft(event.target.value)}
                            />
                            <button type="submit">ارسل</button>
                          </form>
                        </>
                      ) : (
                        <p className="empty-state">Choose a chat from the left side to start messaging.</p>
                      )}
                    </section>
                  </div>
                ) : (
                  <p className="empty-state">Chat is available for User and Vet accounts only.</p>
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
                                <span>{pet.petType} | {pet.breed}</span>
                              </div>
                              <span className={pet.isVaccinesUpToDate ? "pill success" : "pill warning"}>
                                {pet.isVaccinesUpToDate ? t("medical.upToDate", "Vaccines Up To Date") : `${pet.pendingVaccinesCount} ${t("medical.vaccinesNeeded", "Vaccine(s) Needed")}`}
                              </span>
                            </div>
                            <p className="pet-id-line">{t("medical.petId", "Pet ID")}: {pet.collarId}</p>

                            <p className={pet.isVaccinesUpToDate ? "health-summary-card stable" : "health-summary-card attention"}>
                              {pet.healthSummary}
                            </p>

                            <div className="medical-subsection">
                              <div className="medical-subsection-title">
                                <strong>{t("medical.vaccinePlan", "Vaccine Plan")}</strong>
                              </div>
                              {pet.vaccinePlan.length > 0 ? (
                                <div className="list-stack">
                                  {pet.vaccinePlan.map((vaccine) => (
                                    <article key={vaccine.id} className={vaccine.isCompleted ? "list-card medical-mini-card done" : "list-card medical-mini-card due"}>
                                      <strong>{vaccine.vaccineName}</strong>
                                      <div className="meta-line">
                                        <span>{t("medical.status", "Status")}: {vaccine.status}</span>
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
                                      <strong>{record.visitReason}</strong>
                                      <p>{record.diagnosis}</p>
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
                            <strong>{item.title}</strong>
                            <p>{item.message}</p>
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
                            placeholder="Rabies vaccine"
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
                                  <span>{pet.type} | {pet.breed}</span>
                                </div>
                                <span className={petVaccines.length > 0 ? "pill warning" : "pill success"}>
                                  {petVaccines.length > 0 ? `${petVaccines.length} ${t("medical.upcoming", "Upcoming")}` : t("medical.noActiveReminder", "No Active Reminder")}
                                </span>
                              </div>
                              <p className="pet-id-line">{t("medical.petId", "Pet ID")}: {pet.collarId}</p>
                              <div className="meta-line">
                                <span>{t("medical.owner", "Owner")}: {pet.ownerName}</span>
                                <span>{pet.city}</span>
                              </div>

                              <div className="medical-subsection">
                                <strong>{t("medical.activeNeeds", "Active Vaccine Needs")}</strong>
                                <div className="list-stack">
                                  {petVaccines.map((vaccine) => (
                                    <article key={vaccine.id} className="list-card">
                                      <strong>{vaccine.vaccineName}</strong>
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
                            <p>{item.vaccineName}</p>
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

                  <SectionCard title="Vet Role Story" subtitle="How the medical workflow works in this project.">
                    <div className="feature-list">
                      <div>
                        <strong>Create medical history</strong>
                        <p>Veterinarians can create visit notes, diagnoses, and treatment records for each pet.</p>
                      </div>
                      <div>
                        <strong>Update records</strong>
                        <p>Vets can edit existing medical entries as treatment plans change over time.</p>
                      </div>
                      <div>
                        <strong>Track vaccines</strong>
                        <p>The backend identifies vaccines due in the next 30 days and surfaces reminders for owners.</p>
                      </div>
                      <div>
                        <strong>Search by collar ID</strong>
                        <p>Each pet can be found quickly through its unique collar ID to access ownership and health information.</p>
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

