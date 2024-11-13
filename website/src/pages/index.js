import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Admonition from '@theme/Admonition';
import clsx from 'clsx';
import React from 'react';

import styles from './styles.module.css';
import {PageList} from '../components/PageList';

const genericOverview = [
  {
    title: 'GitHub Copilotガイド',
    to: 'github-copilot',
    imageUrl: 'img/undraw_Bibliophile_re_xarc.svg',
    summary: <>開発でGitHub Copilotをすぐ活用するためのガイド</>,
  },
  {
    title: '開発プロセス',
    to: 'development-process',
    imageUrl: 'img/undraw_Outer_space_re_u9vd.svg',
    summary: <>AI活用を前提とした開発プロセスのガイド</>,
  },
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
            AI技術を使って日常の業務をスムーズに進めたいですか？<br/>
            生成AI活用ガイドはTIS株式会社が作成している生成AIを活用するためのガイドラインです。<br/>
            ChatGPTやGitHub Copilotなどの導入方法、基本的な操作、効果的な使い方などを提供します。<br/>  
            どなたでも無償で利用いただけます。
          </p>
          <Admonition type="info">
            <p>
              ページは随時アップデートしていきます。
              改善のため、バグ報告や「こうしたらもっといいな」など、<a href="https://forms.office.com/r/TZCDzPHEZQ">フィードバック</a>をお待ちしています！<br/>
              ※このガイドでは個人情報、社外秘情報は取り扱いません。
            </p>
          </Admonition>
        </div>
        <PageList overviews={genericOverview} colSize={6} />
      </main>
    </Layout>
  );
}

export default Home;