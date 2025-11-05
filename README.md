# Interface de Gerenciamento de Frotas (Angular Frontend)

Este é o repositório do frontend para a aplicação de gerenciamento de frotas. Esta é uma Single Page Application (SPA) construída com **Angular 17+** (usando componentes Standalone) e estilizada com MDBootstrap e NG-Bootstrap.

Este projeto foi projetado para consumir o [Backend Spring Boot de Gerenciamento de Frotas](https://github.com/Hugoangc/localiza) 

##  Funcionalidades Principais

* **Autenticação JWT:** Rota de login dedicada que consome o endpoint `/api/login` e armazena o token JWT no `localStorage`.
* **Guarda de Rotas (`loginGuard`):** Utiliza um `CanActivateFn` (Guarda de Rota) para proteger o endpoint `/admin` e todos os seus filhos.
* **Interceptor HTTP (`http-interceptor`):** Anexa automaticamente o token (`Authorization: Bearer ...`) a todas as requisições HTTP, exceto para o login.
* **Interface CRUD com Modais:** Todos os CRUDs (Carros, Marcas, Acessórios) são gerenciados em uma única página. As listas (`carslist`, `brandslist`, `acessorieslist`) abrem os componentes de detalhes (`carsdetails`, `brandsdetails`, `acessoriesdetails`) dentro de um modal MDBootstrap para criar ou editar registros.
* **Seleção de Relacionamento (Modal-em-Modal):** O formulário `carsdetails` (para criar/editar um carro) abre seus próprios modais para carregar as *listas* de marcas e acessórios, permitindo que o usuário "selecione" um relacionamento.
* **Vinculação/Desvinculação (Linking/Unlinking):** O formulário de carro permite adicionar e remover acessórios (desvincular) da lista antes de salvar.
* **Busca "As-you-type":** As barras de busca nas listas disparam eventos `(keyup)` para filtrar os resultados em tempo real.
* **Paginação:** A lista de acessórios (`acessorieslist`) usa `ngb-pagination` para paginar os resultados do backend.
* **Renderização Condicional (RBAC):** A interface do usuário se adapta com base nas permissões do usuário, como esconder a aba "Acessories" se o usuário não for `ADMIN`.

## Tecnologias Utilizadas (Frontend)

* **Angular 17+** (Componentes Standalone)
* **TypeScript**
* **MDBootstrap para Angular:** Componentes de UI (Modais, Formulários, Botões).
* **NG-Bootstrap:** Usado especificamente para o componente de Paginação.
* **SweetAlert2:** Para notificações de sucesso e erro fáceis de usar.

## Contexto (Conexão com o Backend)

Este frontend não funciona sozinho. Ele foi construído para se comunicar com a API Spring Boot em `http://localhost:8080`.

* **Serviços:** Cada entidade (Car, Brand, Acessory) tem seu próprio `Service` Angular (`CarService`, `BrandService`, `AcessoryService`) que usa `HttpClient` para fazer as chamadas de API.
* **Autenticação:** O `login.service.ts` gerencia o ciclo de vida do token.
* **Tratamento de Erros:** O `meuhttpInterceptor` centraliza o tratamento de erros HTTP, como `401` (Não Autorizado) e `403` (Proibido), redirecionando o usuário para o login caso seu token expire ou seja inválido.

##  Como Rodar

    npm install

    ng s

##  Estrutura dos Componentes

* **`app/auth`:** Contém a lógica de autenticação (serviço, guardião, interceptor) e os modelos de dados (`Login`, `Usuario`).
* **`app/components/layout`:**
    * **`LoginComponent`:** A tela de login.
    * **`PrincipalComponent`:** O layout principal da aplicação (pós-login) que contém o menu e o `<router-outlet>`.
* **`app/components/cars`:**
    * **`CarslistComponent`:** Exibe a lista de carros e abre o modal de detalhes.
    * **`CarsdetailsComponent`:** O formulário (dentro do modal) para criar/editar um carro. Este componente também abre outros modais para selecionar marcas e acessórios.
* **`app/components/brands`:**
    * **`BrandslistComponent`:** Exibe a lista de marcas. Usado tanto como uma página quanto como um "seletor" dentro do modal de carros.
    * **`BrandsdetailsComponent`:** O formulário (dentro do modal) para criar/editar uma marca.
* **`app/components/acessories`:**
    * **`AcessorieslistComponent`:** Exibe a lista paginada de acessórios. Usado como página e como "seletor".
    * **`AcessoriesdetailsComponent`:** O formulário (dentro do modal) para criar/editar um acessório.
