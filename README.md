

```md
# 🧠 Interactive Dictionary — Frontend (React + Vite)

Uma aplicação Web moderna que transforma o aprendizado de palavras em algo interativo e divertido.  
Permite pesquisar palavras, visualizar definições, exemplos, sinônimos, antônimos, ouvir pronúncia e jogar jogos educativos relacionados à palavra pesquisada.

> Este projeto começou quando **o irmão de um amigo me pediu ajuda** para melhorar uma interface simples de consulta de palavras.  
> Acabou evoluindo para um dicionário completo com gamificação e visual moderno.

---

## ✨ Funcionalidades

✅ Campo de busca com sugestões em tempo real  
✅ Definições, exemplos, sinônimos e antônimos organizados visualmente  
✅ Player de áudio para pronúncia da palavra  
✅ Suporte multimídia (imagens relacionadas ao significado)  
✅ Jogos educativos (ex.: anagramas, sinônimos, completar palavra)  
✅ Ao iniciar o jogo, a definição é ocultada (evita spoilers 😄)  
✅ Após sair do jogo, a definição volta automaticamente  
✅ Interface responsiva e moderna com animações suaves  
✅ Toasts e feedback visual para interações do usuário

---

## 🛠 Tecnologias e Ferramentas

| Tecnologia | Uso |
|------------|-----|
| **React** | UI e componentes |
| **Vite** | Build rápido e ambiente dev |
| **React Query / Axios** | Comunicação com API |
| **TypeScript** | Tipagem segura |
| **Tailwind CSS + Shadcn/UI** | Estilização moderna e componentes |
| **Lucide Icons** | Ícones bonitos e leves |
| **Web Speech API (TTS)** | Pronúncia da palavra |

---

## 📁 Estrutura do Projeto

```

📦 interactive_dictionary_frontend
├─ 📁 src
│  ├─ 📁 components
│  │  ├─ SearchBar
│  │  ├─ WordCard
│  │  ├─ ExampleCard
│  │  ├─ SynonymsAntonyms
│  │  ├─ GamePanel
│  │  └─ Toast
│  ├─ 📁 games
│  │  ├─ anagram
│  │  ├─ synonyms-challenge
│  │  └─ complete-word
│  ├─ 📁 services
│  │  └─ api.ts  (axios)
│  ├─ 📁 hooks
│  │  └─ useWordSearch.ts
│  ├─ App.tsx
│  └─ main.tsx
├─ .env
├─ package.json
└─ README.md

````

---

## ⚙️ Instalação e Execução

Clone o repositório:

```sh
git clone https://github.com/seuusuario/interactive_dictionary_frontend.git
cd interactive_dictionary_frontend
````

Instale as dependências:

```sh
npm install
```

Configure o arquivo `.env`:

```
VITE_API_URL=http://localhost:9696/api
```

Inicie o projeto:

```sh
npm run dev
```

Inicia em:

📍 [http://localhost:5173/](http://localhost:5173/)

---

## 🌎 Comunicação com o Backend

O frontend consome os seguintes endpoints do backend:

| Método                 | Endpoint                        | Função |
| ---------------------- | ------------------------------- | ------ |
| `GET /words?query=`    | busca inteligente               |        |
| `GET /words/:id`       | retorna definições e multimídia |        |
| `GET /words/:id/games` | inicia jogo baseado na palavra  |        |
| `POST /auth/login`     | login                           |        |
| `POST /auth/register`  | registro                        |        |

Backend do projeto está disponível aqui:
🔗 [https://github.com/*teu-backend-link](https://github.com/*teu-backend-link)*

---

## 🎮 Jogos Educativos

O frontend renderiza jogos gerados pela API:

➡️ **Anagrama** — ordenar as letras para formar a palavra
➡️ **Sinônimos** — escolha o sinônimo correto
➡️ **Preencher a palavra** — completar a palavra com letras ocultas

Cada jogo possui:

* Pontuação
* Feedback visual imediato
* Exibição da definição somente após o jogo

---

## 🧾 Roadmap

* [ ] Tema Dark/Light
* [ ] Sistema de login + favoritos + histórico de buscas
* [ ] Conquistas e streak de aprendizado
* [ ] Modo “Desafio Diário”

---

## 🤝 Contribuições

Sinta-se à vontade para abrir uma **issue** ou enviar um **pull request**.

---

## 👤 Autor

Desenvolvido por **Isaac Isvaldo Bunga**

🔗 LinkedIn — [https://www.linkedin.com/in/isaacbung4](https://www.linkedin.com/in/isaacbung4)
🌐 Portfólio — [https://isaac-bunga-porfolio.vercel.app/](https://isaac-bunga-porfolio.vercel.app/)

> “Aprender uma nova palavra não precisa ser chato.”

---

```

---

