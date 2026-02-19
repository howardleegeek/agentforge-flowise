<!-- markdownlint-disable MD030 -->

<p align="center">
<strong>AgentForge</strong> branding
</p>

<div align="center">

[![Release Notes](https://img.shields.io/github/release/oyster/agentforge)](https://github.com/oyster/agentforge/releases)
[![Discord](https://img.shields.io/discord/1087698854775881778?label=Discord&logo=discord)](https://discord.gg/jbaHfsRVBW)
[![Twitter Follow](https://img.shields.io/twitter/follow/agentforge?style=social)](https://twitter.com/agentforge)
[![GitHub star chart](https://img.shields.io/github/stars/oyster/agentforge?style=social)](https://star-history.com/#oyster/agentforge)
[![GitHub fork](https://img.shields.io/github/forks/oyster/agentforge?style=social)](https://github.com/oyster/agentforge/fork)

English | [繁體中文](./i18n/README-TW.md) | [简体中文](./i18n/README-ZH.md) | [日本語](./i18n/README-JA.md) | [한국어](./i18n/README-KR.md)

</div>

<h3>Build AI Agents, Visually</h3>
<a href="https://github.com/oyster/agentforge">
<img width="100%" src="https://github.com/oyster/agentforge/raw/main/images/agentforge_agentflow.gif?raw=true"></a>

## 📚 Table of Contents

- [⚡ Quick Start](#-quick-start)
- [🐳 Docker](#-docker)
- [👨‍💻 Developers](#-developers)
- [🌱 Env Variables](#-env-variables)
- [📖 Documentation](#-documentation)
- [🌐 Self Host](#-self-host)
- [☁️ AgentForge Cloud](#-agentforge-cloud)
- [🙋 Support](#-support)
- [🙌 Contributing](#-contributing)
- [📄 License](#-license)

## ⚡Quick Start

Download and Install [NodeJS](https://nodejs.org/en/download) >= 18.15.0

1. Install AgentForge
    ```bash
    npm install -g agentforge
    ```
2. Start AgentForge

    ```bash
    agentforge start
    ```

3. Open [http://localhost:3000](http://localhost:3000)

## 🐳 Docker

### Docker Compose

1. Clone the AgentForge project
2. Go to `docker` folder at the root of the project
3. Copy `.env.example` file, paste it into the same location, and rename to `.env` file
4. `docker compose up -d`
5. Open [http://localhost:3000](http://localhost:3000)
6. You can bring the containers down by `docker compose stop`

### Docker Image

1. Build the image locally:

    ```bash
    docker build --no-cache -t agentforge .
    ```

2. Run image:

    ```bash
    docker run -d --name agentforge -p 3000:3000 agentforge
    ```

3. Stop image:

    ```bash
    docker stop agentforge
    ```

## 👨‍💻 Developers

AgentForge has 3 different modules in a single mono repository.

- `server`: Node backend to serve API logics
- `ui`: React frontend
- `components`: Third-party nodes integrations
- `api-documentation`: Auto-generated swagger-ui API docs from express

### Prerequisite

- Install [PNPM](https://pnpm.io/installation)
    ```bash
    npm i -g pnpm
    ```

### Setup

1.  Clone the repository:

    ```bash
    git clone https://github.com/oyster/agentforge.git
    ```

2.  Go into repository folder:

    ```bash
    cd AgentForge
    ```

3.  Install all dependencies of all modules:

    ```bash
    pnpm install
    ```

4.  Build all the code:

    ```bash
    pnpm build
    ```

    <details>
    <summary>Exit code 134 (JavaScript heap out of memory)</summary>  
    If you get this error when running the above `build` script, try increasing the Node.js heap size and run the script again:

    ```bash
    # macOS / Linux / Git Bash
    export NODE_OPTIONS="--max-old-space-size=4096"

    # Windows PowerShell
    $env:NODE_OPTIONS="--max-old-space-size=4096"

    # Windows CMD
    set NODE_OPTIONS=--max-old-space-size=4096
    ```

    Then run:

    ```bash
    pnpm build
    ```

    </details>

5.  Start the app:

    ```bash
    pnpm start
    ```

    You can now access the app on [http://localhost:3000](http://localhost:3000)

6.  For development build:
    - Create `.env` file and specify the `VITE_PORT` (refer to `.env.example`) in `packages/ui`
    - Create `.env` file and specify the `PORT` (refer to `.env.example`) in `packages/server`
    - Run:

        ```bash
        pnpm dev
        ```

    Any code changes will reload the app automatically on [http://localhost:8080](http://localhost:8080)

## 🌱 Env Variables

AgentForge supports different environment variables to configure your instance. You can specify the following variables in the `.env` file inside `packages/server` folder. Read [more](https://github.com/oyster/agentforge/blob/master/CONTRIBUTING.md#-env-variables)

## 📖 Documentation

You can view the AgentForge Docs [here](https://docs.agentforge.io/)

## 🌐 AgentForge Cloud

Deploy AgentForge self-hosted in your existing infrastructure, we support various [deployments](https://docs.agentforge.io/configuration/deployment)

- [AWS](https://docs.flowiseai.com/configuration/deployment/aws)
- [Azure](https://docs.flowiseai.com/configuration/deployment/azure)
- [Digital Ocean](https://docs.flowiseai.com/configuration/deployment/digital-ocean)
- [GCP](https://docs.flowiseai.com/configuration/deployment/gcp)
- [Alibaba Cloud](https://computenest.console.aliyun.com/service/instance/create/default?type=user&ServiceName=AgentForge社区版)
- <details>
    <summary>Others</summary>
    - [Railway](https://docs.flowiseai.com/configuration/deployment/railway)

                                                  [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/pn4G8S?referralCode=WVNPD9)

                    - [Northflank](https://northflank.com/stacks/deploy-agentforge)

                    [![Deploy to Northflank](https://assets.northflank.com/deploy_to_northflank_smm_36700fb050.svg)](https://northflank.com/stacks/deploy-flowiseai)

                  - [Render](https://docs.agentforge.io/configuration/deployment/render)

                  [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://docs.flowiseai.com/configuration/deployment/render)
                  - [HuggingFace Spaces](https://docs.agentforge.io/deployment/hugging-face)

                  <a href="https://huggingface.co/spaces/AgentForge/AgentForge"><img src="https://huggingface.co/datasets/huggingface/badges/raw/main/open-in-hf-spaces-sm.svg" alt="HuggingFace Spaces"></a>

    - [Elestio](https://elest.io/open-source/flowiseai)

        [![Deploy on Elestio](https://elest.io/images/logos/deploy-to-elestio-btn.png)](https://elest.io/open-source/flowiseai)

    - [Sealos](https://template.sealos.io/deploy?templateName=agentforge)

        [![Deploy on Sealos](https://sealos.io/Deploy-on-Sealos.svg)](https://template.sealos.io/deploy?templateName=flowise)

    - [RepoCloud](https://repocloud.io/details/?app_id=29)

        [![Deploy on RepoCloud](https://d16t0pc4846x52.cloudfront.net/deploy.png)](https://repocloud.io/details/?app_id=29)

                                                </details>

## ☁️ AgentForge Cloud

Get Started with [AgentForge Cloud](https://agentforge.io/).

## 🙋 Support

Feel free to ask any questions, raise problems, and request new features in [Discussion](https://github.com/oyster/agentforge/discussions).

## 🙌 Contributing

Thanks go to these awesome contributors

<a href="https://github.com/oyster/agentforge/graphs/contributors">
<img src="https://contrib.rocks/image?repo=oyster/agentforge" />
</a><br><br>

See [Contributing Guide](CONTRIBUTING.md). Reach out to us at [Discord](https://discord.gg/jbaHfsRVBW) if you have any questions or issues.

[![Star History Chart](https://api.star-history.com/svg?repos=oyster/agentforge&type=Timeline)](https://star-history.com/#oyster/agentforge&Date)

## 📄 License

Source code in this repository is made available under the [Apache License Version 2.0](LICENSE.md).
