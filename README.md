# Interface de Gerenciamento de Frotas (Angular Frontend)

![Angular](https://img.shields.io/badge/Angular-17%2B-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![MDBootstrap](https://img.shields.io/badge/MDBootstrap-3B71CA?style=for-the-badge&logo=bootstrap)
![NG--Bootstrap](https://img.shields.io/badge/NG%20Bootstrap-0D6EFD?style=for-the-badge)
![SweetAlert2](https://img.shields.io/badge/SweetAlert2-F27474?style=for-the-badge)

Este é o repositório do frontend para a aplicação de gerenciamento de frotas. Esta é uma Single Page Application (SPA) construída com **Angular 17+** (usando componentes Standalone) e estilizada com MDBootstrap e NG-Bootstrap.

Este projeto foi projetado para consumir o [Backend Spring Boot de Gerenciamento de Frotas](https://github.com/Hugoangc/localiza_back) e implementa um fluxo de e-commerce completo.

##  Funcionalidades Principais

### 1. Autenticação e Gerenciamento de Usuário
* **Fluxo de Autenticação Completo:**
    * **Registro de Usuário (`/register`):** Permite que novos usuários criem uma conta.
    * **Login (`/login`):** Consome o endpoint `/api/login` e armazena o token JWT no `localStorage`.
* **Interceptor HTTP (`http-interceptor`):** Anexa automaticamente o token (`Authorization: Bearer ...`) a todas as requisições HTTP, exceto para login/registro.
* **Guarda de Rotas (`loginGuard`):** Utiliza um `CanActivateFn` (Guarda de Rota) para proteger rotas (como `/admin` e `/cart`) e redirecionar usuários não autenticados para o login.
* **Decodificação de Token:** O `LoginService` decodifica o payload do token JWT no login para obter `id`, `username` e `role` do usuário, disponibilizando-os para o resto da aplicação.
* **Renderização Condicional (RBAC):** A interface (especialmente o `MenuComponent`) se adapta com base na `role` do usuário (ex: "ADMIN" vs "USER"), mostrando ou escondendo links.

### 2. Fluxo de E-Commerce (Carrinho e Checkout)
* **Gerenciamento de Carrinho (`/cart`):**
    * Um `CartService` dedicado gerencia o estado do carrinho do usuário.
    * O usuário pode adicionar carros com uma seleção específica de acessórios ao carrinho.
    * A tela do carrinho (`CartslistComponent`) permite ao usuário revisar, atualizar ou remover itens antes de prosseguir.
* **Fluxo de Checkout (`/checkout`):**
    * Componente dedicado (`CheckoutsdetailsComponent`) para finalizar o pedido.
    * Coleta de dados de pagamento (simulados) através do `PaymentRequestDTO`.
    * O `OrderService` é chamado para orquestrar o checkout no backend (que por sua vez cria o `Order`, processa o `Payment` e limpa o `Cart`).

### 3. CRUD e UX
* **Interface CRUD com Modais:** Todos os CRUDs de gerenciamento (Carros, Marcas, Acessórios) são gerenciados em uma única página. As listas (`...list`) abrem os componentes de detalhes (`...details`) dentro de um modal MDBootstrap para criar ou editar registros.
* **Seleção de Relacionamento (Modal-em-Modal):** O formulário `carsdetails` (para criar/editar um carro) abre seus próprios modais para carregar as listas de marcas e acessórios, permitindo que o usuário "selecione" um relacionamento.
* **Busca "As-you-type":** Barras de busca nas listas disparam eventos `(keyup)` para filtrar os resultados em tempo real.
* **Paginação:** A lista de acessórios (`AcessorieslistComponent`) usa `ngb-pagination` para paginar os resultados do backend.
* **Notificações:** Utiliza `SweetAlert2` para notificações amigáveis de sucesso e erro.

---

##  Tecnologias Utilizadas (Frontend)

* **Angular 17+** (Componentes Standalone)
* **TypeScript**
* **MDBootstrap para Angular:** Componentes de UI (Modais, Formulários, Botões).
* **NG-Bootstrap:** Usado especificamente para o componente de Paginação.
* **SweetAlert2:** Para notificações (Alerts).
* **jwt-decode:** Para extrair o payload do token JWT no frontend.

---

## Contexto (Conexão com o Backend)

Este frontend não funciona sozinho. Ele foi construído para se comunicar com a API Spring Boot em `http://localhost:8080`.

* **Serviços:** Cada entidade/fluxo tem seu próprio `Service` Angular que usa `HttpClient` para as chamadas de API (ex: `CarService`, `BrandService`, `AcessoryService`, `CartService`, `OrderService`, `UserService`).
* **Modelos e DTOs:** O frontend possui `models` (ex: `car.ts`, `cart.ts`) e `dto` (ex: `cart-item-request.dto.ts`) que espelham as entidades do backend.
* **Tratamento de Erros:** O `http-interceptor` centraliza o tratamento de erros HTTP, como `401` (Não Autorizado) e `403` (Proibido), redirecionando o usuário para o login caso seu token expire ou seja inválido.

---

##  Como Rodar

1.  Clone o repositório.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Execute o servidor de desenvolvimento:
    ```bash
    ng s
    ```
4.  Acesse `http://localhost:4200` no seu navegador.

---

##  Estrutura dos Componentes

A aplicação é modularizada da seguinte forma:

* **`app/auth`**: Lógica de autenticação (Service, Guard, Interceptor) e modelos de dados (Login, Usuario).
* **`app/models`**: Interfaces que espelham as entidades do backend (ex: `car.ts`, `cart.ts`, `order.ts`).
* **`app/services`**: Injeção de `HttpClient` para comunicação com a API (ex: `car.service.ts`, `cart.service.ts`).
* **`app/components/layout`**:
    * `LoginComponent`: A tela de login.
    * `RegisterComponent`: A tela de registro de usuário.
    * `PrincipalComponent`: O layout principal da aplicação (pós-login) que contém o `MenuComponent` e o `<router-outlet>`.
* **`app/components/admin`** (ou similar, contendo os CRUDs):
    * `CarslistComponent` / `CarsdetailsComponent`
    * `BrandslistComponent` / `BrandsdetailsComponent`
    * `AcessorieslistComponent` / `AcessoriesdetailsComponent`
* **`app/components/shop`** (ou similar, contendo o fluxo de compra):
    * `CartslistComponent` / `CartsdetailsComponent`: O carrinho de compras.
    * `CheckoutsdetailsComponent`: O formulário de pagamento e finalização do pedido.
