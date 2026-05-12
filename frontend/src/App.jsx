import { useState, useEffect } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import ChatScreen from './components/ChatScreen'
import ActionPlanScreen from './components/ActionPlanScreen'
import SavedPlansScreen from './components/SavedPlansScreen'

const SCREENS = {
  WELCOME: 'welcome',
  CHAT: 'chat',
  PLAN: 'plan',
  SAVED: 'saved',
}

const MAX_SAVED_PLANS = 20

export default function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME)
  const [situation, setSituation] = useState('')
  const [messages, setMessages] = useState([])
  const [currentPlan, setCurrentPlan] = useState(null)
  const [savedPlans, setSavedPlans] = useState([])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('socialDecode_plans') || '[]')
      setSavedPlans(stored)
    } catch {
      setSavedPlans([])
    }
  }, [])

  function savePlanToStorage(plan) {
    const entry = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      ...plan,
    }
    setSavedPlans((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_SAVED_PLANS)
      localStorage.setItem('socialDecode_plans', JSON.stringify(updated))
      return updated
    })
  }

  function deleteSavedPlan(id) {
    setSavedPlans((prev) => {
      const updated = prev.filter((p) => p.id !== id)
      localStorage.setItem('socialDecode_plans', JSON.stringify(updated))
      return updated
    })
  }

  function startChat(initialSituation) {
    setSituation(initialSituation)
    setMessages([])
    setCurrentPlan(null)
    setScreen(SCREENS.CHAT)
  }

  function handlePlanGenerated(plan) {
    setCurrentPlan(plan)
    setScreen(SCREENS.PLAN)
  }

  function handleSavePlan() {
    if (currentPlan) {
      savePlanToStorage(currentPlan)
    }
  }

  function resetToWelcome() {
    setSituation('')
    setMessages([])
    setCurrentPlan(null)
    setScreen(SCREENS.WELCOME)
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {screen === SCREENS.WELCOME && (
        <WelcomeScreen
          onStart={startChat}
          onViewSaved={() => setScreen(SCREENS.SAVED)}
          savedCount={savedPlans.length}
        />
      )}
      {screen === SCREENS.CHAT && (
        <ChatScreen
          situation={situation}
          messages={messages}
          setMessages={setMessages}
          onPlanGenerated={handlePlanGenerated}
          onNewSituation={resetToWelcome}
        />
      )}
      {screen === SCREENS.PLAN && (
        <ActionPlanScreen
          plan={currentPlan}
          onSave={handleSavePlan}
          onNewSituation={resetToWelcome}
          onBackToChat={() => setScreen(SCREENS.CHAT)}
        />
      )}
      {screen === SCREENS.SAVED && (
        <SavedPlansScreen
          plans={savedPlans}
          onDelete={deleteSavedPlan}
          onBack={() => setScreen(SCREENS.WELCOME)}
        />
      )}
    </div>
  )
}
