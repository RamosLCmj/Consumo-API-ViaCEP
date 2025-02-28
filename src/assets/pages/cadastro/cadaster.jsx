import { useState } from 'react'
import './style.css'

export function CadastroUsuario() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [cep, setCEP] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [sucessMessage, setSucessMessage] = useState('')
    const [logradouro, setLogradouro] = useState('')
    const [bairro, setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')
    const [enderecos, setEnderecos] = useState([]) 

    function clearForm(){
        setName('')
        setEmail('')
        setCEP('')
        setLogradouro('')
        setBairro('')
        setCidade('')
        setEstado('')
    }
    
    function limitCepInput(event) {
        let input = event.target
        input.value = input.value.replace(/[^0-9]/g, '').slice(0, 8) 
    }

    function isValidCep(cep) {
        const cepPattern = /^\d{8}$/ 
        return cepPattern.test(cep)
    }

    async function handleCepBlur() {
        if (!isValidCep(cep)) {
            setErrorMessage('O CEP deve conter 8 dígitos.') 
            return 
        }

        setErrorMessage('') 
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()

            if (data.erro) {
                setErrorMessage('CEP não encontrado!')
                return
            }

            setLogradouro(data.logradouro)
            setBairro(data.bairro)
            setCidade(data.localidade)
            setEstado(data.uf)

        } catch (error) {
            console.error('Erro ao buscar o CEP:', error)
            setErrorMessage('Erro ao buscar o CEP.')
        }
    }

    async function handleCadaster() {
        if (!isValidCep(cep)) {
            setErrorMessage('O CEP deve conter 8 dígitos.')
            return 
        }

        setErrorMessage('')
        setSucessMessage('Cadastrado realizado com Sucesso!')

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            const data = await response.json()

            const novoEndereco = {
                name: name,
                email: email,
                cep: cep,
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                estado: data.uf
            }

            setEnderecos(prevEnderecos => [...prevEnderecos, novoEndereco])
            console.log(enderecos)

            setTimeout(() => {
                clearForm()
                setSucessMessage('')
            }, 1500)

        } catch (error) {
            console.error('Erro ao buscar o CEP:', error)
        }
    }

    return (
        <>
            <div className="container">
                <div className="form">
                    <h1>Cadastro de Usuário</h1>
                    {sucessMessage && <p className='sucess'>{sucessMessage}</p>}
                    <div className="input-wrapper">
                        <label htmlFor="name">Nome: </label>
                        <input type="text" name="name" id="name" onChange={(event) => setName(event.target.value)} value={name} />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="registration">E-mail: </label>
                        <input type="email" name="email" id="email" onChange={(event) => setEmail(event.target.value)} value={email} />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="cep">CEP: </label>
                        <input type="text" name="cep" id="cep" onChange={(event) => setCEP(event.target.value)} value={cep} onInput={limitCepInput} onBlur={handleCepBlur}  />
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="road">Rua: </label>
                        <input type="text" name="road" id="road" onChange={(event) => setLogradouro(event.target.value)} value={logradouro}  />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="neighborhood">Bairro: </label>  
                        <input type="text" name="neighborhood" id="neighborhood" onChange={(event) => setBairro(event.target.value)} value={bairro} />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="city">Cidade: </label>
                        <input type="text" name="city" id="city" onChange={(event) => setCidade(event.target.value)} value={cidade}  />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="state">Estado: </label>
                        <input type="text" name="state" id="state" onChange={(event) => setEstado(event.target.value)} value={estado}  />
                    </div>
                    <button className="btnSubmit" type="button" onClick={handleCadaster} >
                        Cadastrar
                    </button>
                    
                    {enderecos.length > 0 && (
                        <div className="enderecos">
                            <h3>Endereços cadastrados:</h3>
                            <ul>
                                {enderecos.map((endereco, index) => (
                                    <li key={index}>
                                        {`Olá, me chamo ${endereco.name}, e atualmente estou residindo no CEP ${endereco.cep}.`}
                                    </li>
                                ))} 
                            </ul> 
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}