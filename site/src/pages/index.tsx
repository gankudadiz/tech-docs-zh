import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const products = [
  {
    name: 'Filament',
    version: 'v4.x',
    status: '样板接入',
    docs: '/docs/filament/v4.x/introduction/overview',
    source: 'https://github.com/filamentphp/filament/tree/4.x/docs',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="技术文档汉化工作台"
      description="本地优先的技术文档采集、翻译与阅读工作台">
      <main className={styles.shell}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Local documentation workbench</p>
            <Heading as="h1" className={styles.title}>
              技术文档汉化工作台
            </Heading>
            <p className={styles.subtitle}>
              面向长期维护的中文技术文档站。先保存官方结构化原文，再清洗、翻译、校对和本地构建。
            </p>
          </div>
          <div className={styles.statusPanel}>
            <span>当前阶段</span>
            <strong>Filament v4.x 样板</strong>
            <small>raw / normalized / glossary / Docusaurus scaffold</small>
          </div>
        </section>

        <section className={styles.productGrid} aria-label="产品入口">
          {products.map((product) => (
            <article className={styles.productCard} key={product.name}>
              <div>
                <span className={styles.productStatus}>{product.status}</span>
                <Heading as="h2">{product.name}</Heading>
                <p>{product.version} 非官方中文整理入口，来源保留到页面元数据和 manifest。</p>
              </div>
              <div className={styles.cardActions}>
                <Link className="button button--primary" to={product.docs}>
                  打开文档
                </Link>
                <Link className="button button--secondary" to={product.source}>
                  查看原文
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </Layout>
  );
}
