import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { HOME_PERFIL, usePerfil } from './context/PerfilContext'
import { FichaFormPage } from './features/fichas/FichaFormPage'
import { MinhasFichasPage } from './features/fichas/MinhasFichasPage'
import { AtividadesPage } from './features/registro/AtividadesPage'
import { FichaRegistroPage } from './features/registro/FichaRegistroPage'
import { NadaConstaPage } from './features/registro/NadaConstaPage'
import { PainelMesPage } from './features/registro/PainelMesPage'
import { UsuariosPage } from './features/registro/UsuariosPage'
import { LiberacaoChavesPage } from './features/recepcao/LiberacaoChavesPage'
import { MeusProntuariosPage } from './features/prontuarios/MeusProntuariosPage'
import { ProntuariosSupervisaoPage } from './features/prontuarios/ProntuariosSupervisaoPage'
import { RelatoriosPage } from './features/relatorios/RelatoriosPage'
import { ValidacaoPage } from './features/supervisao/ValidacaoPage'

export default function App() {
  const { perfil } = usePerfil()
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to={HOME_PERFIL[perfil]} replace />} />
        <Route path="fichas" element={<MinhasFichasPage />} />
        <Route path="fichas/nova" element={<FichaFormPage />} />
        <Route path="prontuarios" element={<MeusProntuariosPage />} />
        <Route path="validacao" element={<ValidacaoPage />} />
        <Route path="validacao/prontuarios" element={<ProntuariosSupervisaoPage />} />
        <Route path="registro/painel" element={<PainelMesPage />} />
        <Route path="registro/usuarios" element={<UsuariosPage />} />
        <Route path="registro/atividades" element={<AtividadesPage />} />
        <Route path="registro/nada-consta" element={<NadaConstaPage />} />
        <Route path="registro/fichas/:atuanteId/:referencia" element={<FichaRegistroPage />} />
        <Route path="recepcao" element={<LiberacaoChavesPage />} />
        <Route path="relatorios" element={<RelatoriosPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
