import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "user", label: "User Section" },
  { id: "vet", label: "Vet Section" },
  { id: "admin", label: "Admin Section" }
];

const petTypeOptions = ["Cat", "Dog", "Bird", "Rabbit", "Other"];
const petGenderOptions = ["Male", "Female"];

const demoUser = {
  email: "safaaquraan2004@gmail.com",
  password: "safaa1234"
};

const emptyPetForm = {
  name: "",
  type: "Cat",
  breed: "",
  ageInMonths: "",
  gender: "Male",
  collarId: "",
  color: "",
  city: "",
  weightKg: "",
  isNeutered: false,
  description: "",
  photoUrl: "",
  publishForAdoption: true,
  adoptionStory: "",
  contactMethod: "Phone",
  contactDetails: ""
};

const emptyLostForm = {
  petName: "",
  petType: "Cat",
  description: "",
  approximateAgeInMonths: "",
  lastSeenPlace: "",
  lastSeenDateUtc: "",
  rewardAmount: "",
  photoUrl: "",
  contactName: "",
  contactPhone: ""
};

const emptyFoundForm = {
  petType: "Cat",
  description: "",
  foundPlace: "",
  foundDateUtc: "",
  photoUrl: "",
  contactName: "",
  contactPhone: ""
};

const emptyVetCreateForm = {
  petId: "",
  visitReason: "",
  diagnosis: "",
  treatment: "",
  visitDateUtc: ""
};

const emptyVetUpdateForm = {
  recordId: "",
  visitReason: "",
  diagnosis: "",
  treatment: "",
  visitDateUtc: ""
};

const emptyLoginForms = {
  User: { email: demoUser.email, password: demoUser.password },
  Vet: { email: "noor.vet@petcare.jo", password: "Pass123!" },
  Admin: { email: "yaqeenalhammad@gmail.com", password: "yaqeen1234" }
};

const emptyRegisterForms = {
  User: { fullName: "", email: "", password: "", phoneNumber: "", city: "", role: "User" },
  Vet: { fullName: "", email: "", password: "", phoneNumber: "", city: "", role: "Vet" }
};

function normalizeRole(role) {
  return String(role ?? "").toLowerCase();
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function MetricCard({ label, value }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function RoleAuthPanel({
  role,
  currentUser,
  authMode,
  setAuthMode,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  onLogin,
  onRegister,
  onLogout,
  allowRegister,
  demoHint
}) {
  const roleActive = normalizeRole(currentUser?.role) === normalizeRole(role);
  const roleBlockedByOther = currentUser && !roleActive;

  return (
    <section className="panel auth-panel">
      <div className="panel-head">
        <h3>{role} Access</h3>
        {demoHint ? <p>{demoHint}</p> : null}
      </div>

      {roleActive ? (
        <div className="signed-state">
          <p>{currentUser.fullName}</p>
          <p>{currentUser.email}</p>
          <button type="button" onClick={onLogout}>Sign out</button>
        </div>
      ) : null}

      {!currentUser ? (
        <>
          {allowRegister ? (
            <div className="switch-row">
              <button
                type="button"
                className={authMode === "login" ? "switch-btn active" : "switch-btn"}
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={authMode === "register" ? "switch-btn active" : "switch-btn"}
                onClick={() => setAuthMode("register")}
              >
                Register
              </button>
            </div>
          ) : null}

          {authMode === "register" && allowRegister ? (
            <form className="form-grid" onSubmit={onRegister}>
              <input
                type="text"
                placeholder="Full name"
                value={registerForm.fullName}
                onChange={(event) => setRegisterForm((current) => ({ ...current, fullName: event.target.value }))}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="Phone number"
                value={registerForm.phoneNumber}
                onChange={(event) => setRegisterForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="City"
                value={registerForm.city}
                onChange={(event) => setRegisterForm((current) => ({ ...current, city: event.target.value }))}
                required
              />
              <button type="submit">Create {role} account</button>
            </form>
          ) : (
            <form className="form-grid" onSubmit={onLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
              <button type="submit">Login as {role}</button>
            </form>
          )}
        </>
      ) : null}

      {roleBlockedByOther ? (
        <p className="hint">You are logged in as {currentUser.role}. Sign out to access {role} tools.</p>
      ) : null}
    </section>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const [dashboard, setDashboard] = useState(null);
  const [pets, setPets] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [lostPets, setLostPets] = useState([]);
  const [foundPets, setFoundPets] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pendingModeration, setPendingModeration] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionBusy, setSectionBusy] = useState(false);
  const [flash, setFlash] = useState("");
  const [flashType, setFlashType] = useState("info");

  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem("petcareCurrentUser");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const [authMode, setAuthMode] = useState({
    User: "login",
    Vet: "login",
    Admin: "login"
  });
  const [loginForms, setLoginForms] = useState(emptyLoginForms);
  const [registerForms, setRegisterForms] = useState(emptyRegisterForms);
  const [petForm, setPetForm] = useState(emptyPetForm);
  const [lostForm, setLostForm] = useState(emptyLostForm);
  const [foundForm, setFoundForm] = useState(emptyFoundForm);
  const [vetCreateForm, setVetCreateForm] = useState(emptyVetCreateForm);
  const [vetUpdateForm, setVetUpdateForm] = useState(emptyVetUpdateForm);
  const [collarSearch, setCollarSearch] = useState("");

  const isRoleActive = (role) => normalizeRole(currentUser?.role) === normalizeRole(role);

  const matchingPet = useMemo(() => {
    if (!collarSearch.trim()) return null;
    return pets.find((item) => item.collarId.toLowerCase() === collarSearch.trim().toLowerCase()) ?? null;
  }, [pets, collarSearch]);

  async function loadPublicData() {
    const [dashboardData, petsData, adoptionsData, lostData, foundData, vaccinesData] = await Promise.all([
      api.getDashboard(),
      api.getPets(),
      api.getAdoptions(),
      api.getLostPets(),
      api.getFoundPets(),
      api.getUpcomingVaccines()
    ]);

    setDashboard(dashboardData);
    setPets(petsData);
    setAdoptions(adoptionsData);
    setLostPets(lostData);
    setFoundPets(foundData);
    setVaccines(vaccinesData);
  }

  async function loadModeration() {
    if (!isRoleActive("Admin")) return;
    const items = await api.getPendingModeration();
    setPendingModeration(items);
  }

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await loadPublicData();
      } catch {
        if (active) {
          setFlashType("error");
          setFlash("Could not load API data. Start backend and refresh.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
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
    if (activeSection === "admin" && isRoleActive("Admin")) {
      loadModeration().catch(() => {
        setFlashType("error");
        setFlash("Could not load moderation queue.");
      });
    }
  }, [activeSection, currentUser]);

  function setNotice(message, type = "info") {
    setFlash(message);
    setFlashType(type);
  }

  async function handleRoleLogin(role, event) {
    event.preventDefault();
    const credentials = loginForms[role];

    try {
      const user = await api.login(credentials.email.trim(), credentials.password);
      if (normalizeRole(user.role) !== normalizeRole(role)) {
        setNotice(`This account is ${user.role}. Please use the ${user.role} section.`, "error");
        return;
      }

      setCurrentUser(user);
      setNotice(`Welcome ${user.fullName}.`, "success");
    } catch (error) {
      setNotice(error.message || "Login failed.", "error");
    }
  }

  async function handleRoleRegister(role, event) {
    event.preventDefault();
    const payload = registerForms[role];

    try {
      const user = await api.register({
        ...payload,
        role
      });
      setCurrentUser(user);
      setRegisterForms((current) => ({
        ...current,
        [role]: { ...emptyRegisterForms[role] }
      }));
      setNotice("Account created successfully.", "success");
    } catch (error) {
      setNotice(error.message || "Registration failed.", "error");
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setNotice("Signed out.", "info");
  }

  async function submitPet(event) {
    event.preventDefault();
    setSectionBusy(true);

    try {
      await api.createPet({
        name: petForm.name,
        type: petForm.type,
        breed: petForm.breed,
        ageInMonths: Number(petForm.ageInMonths),
        gender: petForm.gender,
        collarId: petForm.collarId,
        color: petForm.color,
        city: petForm.city,
        weightKg: Number(petForm.weightKg),
        isNeutered: petForm.isNeutered,
        description: petForm.description,
        photoUrl: petForm.photoUrl,
        publishForAdoption: petForm.publishForAdoption,
        adoptionStory: petForm.adoptionStory || null,
        contactMethod: petForm.contactMethod || null,
        contactDetails: petForm.contactDetails || null
      });
      setPetForm(emptyPetForm);
      await loadPublicData();
      setNotice("Pet submitted successfully. It is pending admin approval.", "success");
    } catch (error) {
      setNotice(error.message || "Could not submit pet.", "error");
    } finally {
      setSectionBusy(false);
    }
  }

  async function submitLostReport(event) {
    event.preventDefault();
    setSectionBusy(true);

    try {
      await api.createLostPetReport({
        petName: lostForm.petName,
        petType: lostForm.petType,
        description: lostForm.description,
        approximateAgeInMonths: Number(lostForm.approximateAgeInMonths),
        lastSeenPlace: lostForm.lastSeenPlace,
        lastSeenDateUtc: new Date(lostForm.lastSeenDateUtc).toISOString(),
        rewardAmount: lostForm.rewardAmount ? Number(lostForm.rewardAmount) : null,
        photoUrl: lostForm.photoUrl,
        contactName: lostForm.contactName,
        contactPhone: lostForm.contactPhone
      });
      setLostForm(emptyLostForm);
      await loadPublicData();
      setNotice("Lost pet post submitted and waiting for admin approval.", "success");
    } catch (error) {
      setNotice(error.message || "Could not submit lost report.", "error");
    } finally {
      setSectionBusy(false);
    }
  }

  async function submitFoundReport(event) {
    event.preventDefault();
    setSectionBusy(true);

    try {
      await api.createFoundPetReport({
        petType: foundForm.petType,
        description: foundForm.description,
        foundPlace: foundForm.foundPlace,
        foundDateUtc: new Date(foundForm.foundDateUtc).toISOString(),
        photoUrl: foundForm.photoUrl,
        contactName: foundForm.contactName,
        contactPhone: foundForm.contactPhone
      });
      setFoundForm(emptyFoundForm);
      await loadPublicData();
      setNotice("Found pet post submitted and waiting for admin approval.", "success");
    } catch (error) {
      setNotice(error.message || "Could not submit found report.", "error");
    } finally {
      setSectionBusy(false);
    }
  }

  async function submitMedicalRecord(event) {
    event.preventDefault();
    setSectionBusy(true);

    try {
      await api.createMedicalRecord({
        petId: Number(vetCreateForm.petId),
        visitReason: vetCreateForm.visitReason,
        diagnosis: vetCreateForm.diagnosis,
        treatment: vetCreateForm.treatment,
        visitDateUtc: new Date(vetCreateForm.visitDateUtc).toISOString()
      });
      setVetCreateForm(emptyVetCreateForm);
      setNotice("Medical record created successfully.", "success");
    } catch (error) {
      setNotice(error.message || "Could not create medical record.", "error");
    } finally {
      setSectionBusy(false);
    }
  }

  async function submitMedicalUpdate(event) {
    event.preventDefault();
    setSectionBusy(true);

    try {
      await api.updateMedicalRecord(Number(vetUpdateForm.recordId), {
        visitReason: vetUpdateForm.visitReason,
        diagnosis: vetUpdateForm.diagnosis,
        treatment: vetUpdateForm.treatment,
        visitDateUtc: new Date(vetUpdateForm.visitDateUtc).toISOString()
      });
      setVetUpdateForm(emptyVetUpdateForm);
      setNotice("Medical record updated successfully.", "success");
    } catch (error) {
      setNotice(error.message || "Could not update medical record.", "error");
    } finally {
      setSectionBusy(false);
    }
  }

  async function handleModerationAction(action, kind, id) {
    setSectionBusy(true);
    try {
      if (action === "approve") {
        await api.approveModerationItem(kind, id);
      } else if (action === "reject") {
        await api.rejectModerationItem(kind, id);
      } else {
        await api.deleteModerationItem(kind, id);
      }

      await Promise.all([loadModeration(), loadPublicData()]);
      setNotice("Moderation action completed.", "success");
    } catch (error) {
      setNotice(error.message || "Moderation action failed.", "error");
    } finally {
      setSectionBusy(false);
    }
  }

  return (
    <div className="pcj-app">
      <header className="hero">
        <div className="hero-copy">
          <p className="badge">PetCare Jordan</p>
          <h1>Pet adoption, lost-and-found, veterinary history, and moderation in one professional dashboard.</h1>
          <p>
            Dashboard stays enabled, while user, vet, and admin each have separate access sections with real login and
            role validation.
          </p>
        </div>
        <div className="hero-panel">
          <h3>Analytics Snapshot</h3>
          {!dashboard ? <p>Loading...</p> : (
            <div className="metric-grid">
              <MetricCard label="Pets" value={dashboard.totalPets} />
              <MetricCard label="Adoptions" value={dashboard.petsForAdoption} />
              <MetricCard label="Lost Reports" value={dashboard.lostReports} />
              <MetricCard label="Pending Approval" value={dashboard.pendingModeration} />
            </div>
          )}
        </div>
      </header>

      <nav className="section-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={activeSection === section.id ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {flash ? <div className={flashType === "error" ? "flash error" : "flash"}>{flash}</div> : null}
      {isLoading ? <div className="panel">Loading project data...</div> : null}

      {!isLoading && activeSection === "overview" ? (
        <section className="content-grid">
          <article className="panel">
            <div className="panel-head">
              <h3>Dashboard Details</h3>
              <p>Core numbers for your graduation project report.</p>
            </div>
            {dashboard ? (
              <div className="metric-grid full">
                <MetricCard label="Registered users" value={dashboard.totalUsers} />
                <MetricCard label="Veterinarians" value={dashboard.totalVets} />
                <MetricCard label="Found reports" value={dashboard.foundReports} />
                <MetricCard label="Upcoming vaccines" value={dashboard.upcomingVaccines} />
              </div>
            ) : null}
          </article>

          <article className="panel">
            <div className="panel-head">
              <h3>Adoption Feed</h3>
              <p>Only admin-approved posts are visible here.</p>
            </div>
            <div className="card-grid">
              {adoptions.slice(0, 6).map((item) => (
                <article key={item.id} className="post-card">
                  <div className="media-frame">
                    <img src={item.photoUrl} alt={item.petName} />
                  </div>
                  <div className="post-body">
                    <strong>{item.petName}</strong>
                    <span>{item.petType} • {item.city}</span>
                    <p>{item.story}</p>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {!isLoading && activeSection === "user" ? (
        <section className="content-grid">
          <RoleAuthPanel
            role="User"
            currentUser={currentUser}
            authMode={authMode.User}
            setAuthMode={(mode) => setAuthMode((current) => ({ ...current, User: mode }))}
            loginForm={loginForms.User}
            setLoginForm={(updater) => setLoginForms((current) => ({
              ...current,
              User: typeof updater === "function" ? updater(current.User) : updater
            }))}
            registerForm={registerForms.User}
            setRegisterForm={(updater) => setRegisterForms((current) => ({
              ...current,
              User: typeof updater === "function" ? updater(current.User) : updater
            }))}
            onLogin={(event) => handleRoleLogin("User", event)}
            onRegister={(event) => handleRoleRegister("User", event)}
            onLogout={handleLogout}
            allowRegister
            demoHint={`Demo user: ${demoUser.email} / ${demoUser.password}`}
          />

          {isRoleActive("User") ? (
            <div className="two-col-grid">
              <article className="panel">
                <div className="panel-head">
                  <h3>Publish Pet for Directory/Adoption</h3>
                  <p>Every new post goes to pending until admin approval.</p>
                </div>
                <form className="form-grid" onSubmit={submitPet}>
                  <input type="text" placeholder="Pet name" value={petForm.name} onChange={(event) => setPetForm((current) => ({ ...current, name: event.target.value }))} required />
                  <select value={petForm.type} onChange={(event) => setPetForm((current) => ({ ...current, type: event.target.value }))}>
                    {petTypeOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <input type="text" placeholder="Breed" value={petForm.breed} onChange={(event) => setPetForm((current) => ({ ...current, breed: event.target.value }))} required />
                  <input type="number" min="1" placeholder="Age (months)" value={petForm.ageInMonths} onChange={(event) => setPetForm((current) => ({ ...current, ageInMonths: event.target.value }))} required />
                  <select value={petForm.gender} onChange={(event) => setPetForm((current) => ({ ...current, gender: event.target.value }))}>
                    {petGenderOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <input type="text" placeholder="Collar ID (unique)" value={petForm.collarId} onChange={(event) => setPetForm((current) => ({ ...current, collarId: event.target.value }))} required />
                  <input type="text" placeholder="Color" value={petForm.color} onChange={(event) => setPetForm((current) => ({ ...current, color: event.target.value }))} required />
                  <input type="text" placeholder="City" value={petForm.city} onChange={(event) => setPetForm((current) => ({ ...current, city: event.target.value }))} required />
                  <input type="number" min="0" step="0.1" placeholder="Weight (kg)" value={petForm.weightKg} onChange={(event) => setPetForm((current) => ({ ...current, weightKg: event.target.value }))} required />
                  <input type="url" placeholder="Photo URL" value={petForm.photoUrl} onChange={(event) => setPetForm((current) => ({ ...current, photoUrl: event.target.value }))} required />
                  <textarea placeholder="Description" value={petForm.description} onChange={(event) => setPetForm((current) => ({ ...current, description: event.target.value }))} required />
                  <label className="checkbox-row">
                    <input type="checkbox" checked={petForm.isNeutered} onChange={(event) => setPetForm((current) => ({ ...current, isNeutered: event.target.checked }))} />
                    Neutered
                  </label>
                  <label className="checkbox-row">
                    <input type="checkbox" checked={petForm.publishForAdoption} onChange={(event) => setPetForm((current) => ({ ...current, publishForAdoption: event.target.checked }))} />
                    Publish for adoption too
                  </label>
                  <textarea placeholder="Adoption story (optional)" value={petForm.adoptionStory} onChange={(event) => setPetForm((current) => ({ ...current, adoptionStory: event.target.value }))} />
                  <input type="text" placeholder="Contact method (Phone/Email)" value={petForm.contactMethod} onChange={(event) => setPetForm((current) => ({ ...current, contactMethod: event.target.value }))} />
                  <input type="text" placeholder="Contact details" value={petForm.contactDetails} onChange={(event) => setPetForm((current) => ({ ...current, contactDetails: event.target.value }))} />
                  <button type="submit" disabled={sectionBusy}>Submit pet</button>
                </form>
              </article>

              <article className="panel">
                <div className="panel-head">
                  <h3>Lost & Found Posting</h3>
                  <p>Photos and reports require admin review before public visibility.</p>
                </div>
                <form className="form-grid compact" onSubmit={submitLostReport}>
                  <h4>Lost Pet Report</h4>
                  <input type="text" placeholder="Pet name" value={lostForm.petName} onChange={(event) => setLostForm((current) => ({ ...current, petName: event.target.value }))} required />
                  <select value={lostForm.petType} onChange={(event) => setLostForm((current) => ({ ...current, petType: event.target.value }))}>
                    {petTypeOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <textarea placeholder="Description" value={lostForm.description} onChange={(event) => setLostForm((current) => ({ ...current, description: event.target.value }))} required />
                  <input type="number" min="1" placeholder="Age (months)" value={lostForm.approximateAgeInMonths} onChange={(event) => setLostForm((current) => ({ ...current, approximateAgeInMonths: event.target.value }))} required />
                  <input type="text" placeholder="Last seen place" value={lostForm.lastSeenPlace} onChange={(event) => setLostForm((current) => ({ ...current, lastSeenPlace: event.target.value }))} required />
                  <input type="datetime-local" value={lostForm.lastSeenDateUtc} onChange={(event) => setLostForm((current) => ({ ...current, lastSeenDateUtc: event.target.value }))} required />
                  <input type="number" min="0" step="0.5" placeholder="Reward (optional)" value={lostForm.rewardAmount} onChange={(event) => setLostForm((current) => ({ ...current, rewardAmount: event.target.value }))} />
                  <input type="url" placeholder="Photo URL" value={lostForm.photoUrl} onChange={(event) => setLostForm((current) => ({ ...current, photoUrl: event.target.value }))} required />
                  <input type="text" placeholder="Contact name" value={lostForm.contactName} onChange={(event) => setLostForm((current) => ({ ...current, contactName: event.target.value }))} required />
                  <input type="text" placeholder="Contact phone" value={lostForm.contactPhone} onChange={(event) => setLostForm((current) => ({ ...current, contactPhone: event.target.value }))} required />
                  <button type="submit" disabled={sectionBusy}>Post lost report</button>
                </form>

                <form className="form-grid compact" onSubmit={submitFoundReport}>
                  <h4>Found Pet Report</h4>
                  <select value={foundForm.petType} onChange={(event) => setFoundForm((current) => ({ ...current, petType: event.target.value }))}>
                    {petTypeOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <textarea placeholder="Description" value={foundForm.description} onChange={(event) => setFoundForm((current) => ({ ...current, description: event.target.value }))} required />
                  <input type="text" placeholder="Found place" value={foundForm.foundPlace} onChange={(event) => setFoundForm((current) => ({ ...current, foundPlace: event.target.value }))} required />
                  <input type="datetime-local" value={foundForm.foundDateUtc} onChange={(event) => setFoundForm((current) => ({ ...current, foundDateUtc: event.target.value }))} required />
                  <input type="url" placeholder="Photo URL" value={foundForm.photoUrl} onChange={(event) => setFoundForm((current) => ({ ...current, photoUrl: event.target.value }))} required />
                  <input type="text" placeholder="Contact name" value={foundForm.contactName} onChange={(event) => setFoundForm((current) => ({ ...current, contactName: event.target.value }))} required />
                  <input type="text" placeholder="Contact phone" value={foundForm.contactPhone} onChange={(event) => setFoundForm((current) => ({ ...current, contactPhone: event.target.value }))} required />
                  <button type="submit" disabled={sectionBusy}>Post found report</button>
                </form>
              </article>
            </div>
          ) : null}
        </section>
      ) : null}

      {!isLoading && activeSection === "vet" ? (
        <section className="content-grid">
          <RoleAuthPanel
            role="Vet"
            currentUser={currentUser}
            authMode={authMode.Vet}
            setAuthMode={(mode) => setAuthMode((current) => ({ ...current, Vet: mode }))}
            loginForm={loginForms.Vet}
            setLoginForm={(updater) => setLoginForms((current) => ({
              ...current,
              Vet: typeof updater === "function" ? updater(current.Vet) : updater
            }))}
            registerForm={registerForms.Vet}
            setRegisterForm={(updater) => setRegisterForms((current) => ({
              ...current,
              Vet: typeof updater === "function" ? updater(current.Vet) : updater
            }))}
            onLogin={(event) => handleRoleLogin("Vet", event)}
            onRegister={(event) => handleRoleRegister("Vet", event)}
            onLogout={handleLogout}
            allowRegister
            demoHint="Existing vet demo: noor.vet@petcare.jo / Pass123!"
          />

          {isRoleActive("Vet") ? (
            <div className="two-col-grid">
              <article className="panel">
                <div className="panel-head">
                  <h3>Create Medical Record</h3>
                  <p>Vets can create and update records from this section.</p>
                </div>
                <form className="form-grid" onSubmit={submitMedicalRecord}>
                  <input type="number" min="1" placeholder="Pet ID" value={vetCreateForm.petId} onChange={(event) => setVetCreateForm((current) => ({ ...current, petId: event.target.value }))} required />
                  <input type="text" placeholder="Visit reason" value={vetCreateForm.visitReason} onChange={(event) => setVetCreateForm((current) => ({ ...current, visitReason: event.target.value }))} required />
                  <input type="text" placeholder="Diagnosis" value={vetCreateForm.diagnosis} onChange={(event) => setVetCreateForm((current) => ({ ...current, diagnosis: event.target.value }))} required />
                  <textarea placeholder="Treatment plan" value={vetCreateForm.treatment} onChange={(event) => setVetCreateForm((current) => ({ ...current, treatment: event.target.value }))} required />
                  <input type="datetime-local" value={vetCreateForm.visitDateUtc} onChange={(event) => setVetCreateForm((current) => ({ ...current, visitDateUtc: event.target.value }))} required />
                  <button type="submit" disabled={sectionBusy}>Create record</button>
                </form>

                <form className="form-grid" onSubmit={submitMedicalUpdate}>
                  <h4>Update Existing Record</h4>
                  <input type="number" min="1" placeholder="Record ID" value={vetUpdateForm.recordId} onChange={(event) => setVetUpdateForm((current) => ({ ...current, recordId: event.target.value }))} required />
                  <input type="text" placeholder="Visit reason" value={vetUpdateForm.visitReason} onChange={(event) => setVetUpdateForm((current) => ({ ...current, visitReason: event.target.value }))} required />
                  <input type="text" placeholder="Diagnosis" value={vetUpdateForm.diagnosis} onChange={(event) => setVetUpdateForm((current) => ({ ...current, diagnosis: event.target.value }))} required />
                  <textarea placeholder="Treatment plan" value={vetUpdateForm.treatment} onChange={(event) => setVetUpdateForm((current) => ({ ...current, treatment: event.target.value }))} required />
                  <input type="datetime-local" value={vetUpdateForm.visitDateUtc} onChange={(event) => setVetUpdateForm((current) => ({ ...current, visitDateUtc: event.target.value }))} required />
                  <button type="submit" disabled={sectionBusy}>Update record</button>
                </form>
              </article>

              <article className="panel">
                <div className="panel-head">
                  <h3>Vet Tools</h3>
                  <p>Search pets by collar ID and review upcoming vaccines.</p>
                </div>
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search exact collar ID (example: PCJ-1001)"
                  value={collarSearch}
                  onChange={(event) => setCollarSearch(event.target.value)}
                />
                {matchingPet ? (
                  <article className="inline-result">
                    <div className="media-frame small">
                      <img src={matchingPet.photoUrl} alt={matchingPet.name} />
                    </div>
                    <div>
                      <strong>{matchingPet.name}</strong>
                      <p>{matchingPet.type} • {matchingPet.breed}</p>
                      <p>{matchingPet.city} • {matchingPet.collarId}</p>
                    </div>
                  </article>
                ) : null}
                <div className="list-grid">
                  {vaccines.slice(0, 12).map((item) => (
                    <article key={item.id} className="list-item">
                      <strong>{item.petName}</strong>
                      <span>{item.vaccineName}</span>
                      <span>Due: {formatDate(item.dueDateUtc)}</span>
                      <span>Owner: {item.ownerName} ({item.ownerPhone})</span>
                    </article>
                  ))}
                </div>
              </article>
            </div>
          ) : null}
        </section>
      ) : null}

      {!isLoading && activeSection === "admin" ? (
        <section className="content-grid">
          <RoleAuthPanel
            role="Admin"
            currentUser={currentUser}
            authMode={authMode.Admin}
            setAuthMode={(mode) => setAuthMode((current) => ({ ...current, Admin: mode }))}
            loginForm={loginForms.Admin}
            setLoginForm={(updater) => setLoginForms((current) => ({
              ...current,
              Admin: typeof updater === "function" ? updater(current.Admin) : updater
            }))}
            registerForm={{}}
            setRegisterForm={() => {}}
            onLogin={(event) => handleRoleLogin("Admin", event)}
            onRegister={() => {}}
            onLogout={handleLogout}
            allowRegister={false}
            demoHint="Admin moderation controls for pending images and posts."
          />

          {isRoleActive("Admin") ? (
            <article className="panel">
              <div className="panel-head">
                <h3>Pending Moderation Queue</h3>
                <p>Approve, reject, or remove user-submitted content before it goes public.</p>
              </div>

              {pendingModeration.length === 0 ? (
                <p className="hint">No pending posts right now.</p>
              ) : (
                <div className="moderation-grid">
                  {pendingModeration.map((item) => (
                    <article key={`${item.kind}-${item.itemId}`} className="post-card">
                      <div className="media-frame">
                        <img src={item.photoUrl} alt={item.title} />
                      </div>
                      <div className="post-body">
                        <strong>{item.title}</strong>
                        <span>{item.kind.toUpperCase()} • {item.city}</span>
                        <p>{item.description}</p>
                        <div className="meta-line">
                          <span>Contact: {item.contactName}</span>
                          <span>{formatDate(item.submittedAtUtc)}</span>
                        </div>
                        <div className="action-row">
                          <button type="button" onClick={() => handleModerationAction("approve", item.kind, item.itemId)} disabled={sectionBusy}>Approve</button>
                          <button type="button" className="warn" onClick={() => handleModerationAction("reject", item.kind, item.itemId)} disabled={sectionBusy}>Reject</button>
                          <button type="button" className="danger" onClick={() => handleModerationAction("delete", item.kind, item.itemId)} disabled={sectionBusy}>Remove</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </article>
          ) : null}
        </section>
      ) : null}

      {!isLoading && isRoleActive("User") && notifications.length > 0 ? (
        <section className="panel">
          <div className="panel-head">
            <h3>User Notifications</h3>
            <p>Vaccine reminders for the logged-in owner.</p>
          </div>
          <div className="list-grid">
            {notifications.map((item) => (
              <article key={item.id} className="list-item">
                <strong>{item.title}</strong>
                <span>{item.message}</span>
                <span>{formatDate(item.triggerDateUtc)}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default App;
