# DDD

O DDD (Domain-Driven Design), em português "Projeto Orientado a Domínio", é uma abordagem de design de software que tem como objetivo principal modelar o software em torno do domínio do problema, ou seja, o conjunto de conceitos e regras de negócio que são relevantes para a aplicação.

No DDD, o domínio é considerado o coração do software, e a ideia é refletir com precisão as complexidades e nuances desse domínio na estrutura do código e no design da aplicação. O foco principal é entender e expressar o domínio de forma clara, e então utilizar essa compreensão para orientar o desenvolvimento do software.

Alguns conceitos-chave do DDD incluem:

- **Agregados**: Agrupam objetos relacionados do domínio em uma unidade coesa. Os agregados possuem uma raiz, chamada de "entidade raiz", que é responsável por garantir a consistência e a integridade do agregado como um todo.

- **Entidades**: São objetos que possuem identidade própria e que podem ser distinguidos por seus atributos. As entidades representam os objetos do domínio que têm uma existência significativa e podem ter seu ciclo de vida gerenciado pelo sistema.

- **Value Objects (Objetos de Valor)**: São objetos que não possuem identidade própria e são definidos exclusivamente por seus atributos. Eles são imutáveis e representam um valor específico dentro do domínio.

- **Serviços de Domínio**: São classes ou componentes responsáveis por executar operações que não se encaixam bem em entidades ou objetos de valor individuais. Os serviços de domínio encapsulam a lógica de negócio complexa que envolve múltiplas entidades ou objetos de valor.

- **Bounded Context (Contexto Delimitado)**: É uma fronteira lógica que define os limites de um modelo de domínio específico. Um sistema complexo pode ter vários bounded contexts, cada um representando um aspecto diferente do domínio e encapsulando suas próprias regras e conceitos.

O DDD também incentiva a comunicação e colaboração próxima entre especialistas do domínio e desenvolvedores, para garantir que o conhecimento do negócio seja adequadamente incorporado no software.

Ao adotar o DDD, espera-se obter um design de software mais flexível, modular e com maior aderência às necessidades do negócio, permitindo a evolução contínua do sistema de acordo com as mudanças do domínio.
