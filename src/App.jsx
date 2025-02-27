import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CadastroUsuario } from "./assets/pages/cadastro/cadaster";

export function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CadastroUsuario />}/>
      </Routes>
     </BrowserRouter> 
    </>
  )
}


