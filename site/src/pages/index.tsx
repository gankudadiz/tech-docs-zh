import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const products = [
  {
    name: 'Filament',
    version: 'v4.x',
    status: '翻译中',
    pages: '5 个样板页面',
    stage: '结构验证中',
    docs: '/docs/filament/v4.x/introduction/overview',
    source: 'https://github.com/filamentphp/filament/tree/4.x/docs',
    description:
      'Laravel 生态的 Server-Driven UI 框架文档。当前保留官方原文快照，并接入一组 normalized 页面用于验证阅读、翻译和校对流程。',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="文档书架"
      description="本地优先的中文技术文档阅读站">
      <main className={styles.page}>
        <section className={styles.masthead}>
          <div className={styles.mastheadCopy}>
            <p className={styles.kicker}>Chinese Technical Documentation</p>
            <Heading as="h1" className={styles.title}>
              中文技术文档站
            </Heading>
            <p className={styles.subtitle}>
              面向长期维护的中文技术文档阅读站。收录常用开发框架的官方文档中文翻译版本，提供统一的阅读体验。
            </p>
          </div>
        </section>

        <section className={styles.library} aria-labelledby="library-heading">
          <div className={styles.sectionLead}>
            <p className={styles.kicker}>Library</p>
            <Heading as="h2" id="library-heading">
              已收录产品
            </Heading>
          </div>

          {products.map((product) => (
            <article className={styles.product} key={product.name}>
              <div className={styles.productMain}>
                <div className={styles.productHeader}>
                  <span className={styles.status}>{product.status}</span>
                  <span>{product.version}</span>
                </div>
                <Heading as="h3">{product.name}</Heading>
                <p>{product.description}</p>
              </div>

              <dl className={styles.productMeta}>
                <div>
                  <dt>页面</dt>
                  <dd>{product.pages}</dd>
                </div>
                <div>
                  <dt>阶段</dt>
                  <dd>{product.stage}</dd>
                </div>
              </dl>

              <div className={styles.actions}>
                <Link className={`${styles.action} ${styles.actionPrimary}`} to={product.docs}>
                  开始阅读
                </Link>
                <Link className={styles.action} to={product.source}>
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
