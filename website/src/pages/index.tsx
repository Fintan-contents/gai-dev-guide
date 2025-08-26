import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Admonition from '@theme/Admonition';
import clsx from 'clsx';
import React from 'react';

import styles from './styles.module.css';
import {PageList} from '../components/PageList';
import Link from '@docusaurus/Link';

const genericOverview = [
  {
    title: 'GitHub Copilot活用ガイド',
    to: 'github-copilot-guide',
    imageUrl: 'img/undraw_Bibliophile_re_xarc.svg',
    summary: <>GitHub Copilotを活用して生産性を向上するためのガイド</>,
  },
  {
    title: 'プロンプト',
    to: 'prompts',
    imageUrl: 'img/undraw_Bookshelves_re_lxoy.svg',
    summary: <>AI活用のためのプロンプト集</>,
  }
];


function Home() {
  const context = useDocusaurusContext();
  return (
    <Layout>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">Generative AI</h1>
        </div>
      </header>
      <main>
        <div className={clsx("container", styles.descriptionContainer)}>
          <p>
            <br/>
            生成AI エンジニアリング活用ガイドは、開発プロセスにおいてすぐに生成AIを活用できるように設計された、TIS株式会社が提供しているガイドラインです。<br/>
            ChatGPTやGitHub Copilotなどの導入方法、開発プロセスにおける生成AIの具体的な活用方法などを提供します。<br/>  
            どなたでも無償で利用いただけます。
          </p>
        </div>
        <PageList overviews={genericOverview} colSize={6} />
        <div className={clsx("container", styles.descriptionContainer)}>
          <Admonition type="note">
            <p>
              ページは随時アップデートしていきます。
              改善のため、バグ報告や「こうしたらもっといいな」など、<a href="https://forms.office.com/r/TZCDzPHEZQ">フィードバック</a>をお待ちしています！<br/>
              ※このガイドでは個人情報、社外秘情報は取り扱いません。
            </p>
          </Admonition>
          <Admonition type="info">
            <p>
              色々な開発プロジェクトがあるなかで、必ずしも本ガイドどおりに開発するケースは稀です。<br/>
              そこで本ガイドでは、プロジェクトの様々な特性に合わせて、ガイドを個別にカスタマイズできるようにしています。<br/>
              さらに、オフライン環境で開発する方向けであっても参照できるように、参照時にWEBサーバを必要としないHTMLファイルとして配布可能です。<br/>
              詳細は<Link to="/customize-and-distribution">ガイドのカスタマイズ・配布</Link>をお読みください
            </p>
          </Admonition>
        </div>
      </main>
    </Layout>
  );
}

export default Home;
