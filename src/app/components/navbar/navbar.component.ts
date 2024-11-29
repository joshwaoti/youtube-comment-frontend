import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface FloatingWord {
  text: string;
  delay: string;
  left: string;
  top: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="navbar-container">
      <div class="navbar-card">
        <div class="continuous-bar"></div>
        <div class="navbar-logo">
          <mat-icon class="logo-icon">videocam</mat-icon>
        </div>
        <div class="navbar-links">
          <a routerLink="/home" class="navbar-link">Home</a>
          <a routerLink="/recent" class="navbar-link">Recent</a>
        </div>
        <div class="floating-words">
          @for (word of floatingWords; track word.text) {
            <span 
              class="floating-word"
              [style.animation-delay]="word.delay"
              [style.left]="word.left"
              [style.top]="word.top"
            >
              {{ word.text }}
            </span>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .navbar-container {
      display: flex;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
      margin-bottom: 3rem;
    }

    .navbar-card {
      position: relative;
      width: 75%;
      max-width: 1200px;
      height: 80px;
      background: transparent;
      border-radius: 1.5rem;
      padding: 1.5rem 3rem;
      overflow: visible;

      @media (max-width: 768px) {
        width: 95%;
        padding: 1rem 1.5rem;
        height: 70px;
      }
    }

    .continuous-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: rgba(26, 26, 46, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 1.5rem;
      border: 1px solid rgba(0, 255, 255, 0.1);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.1),
                  0 0 30px rgba(0, 255, 255, 0.05);
      mask: radial-gradient(circle at 50% 120%, 
             transparent 35px,
             black 36px);
      -webkit-mask: radial-gradient(circle at 50% 120%, 
                    transparent 35px,
                    black 36px);
    }

    .navbar-logo {
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(to right, rgb(6, 182, 212), rgb(147, 51, 234));
      border-radius: 50%;
      padding: 1.75rem;
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.5),
                  0 0 40px rgba(147, 51, 234, 0.3);
      z-index: 10;

      @media (min-width: 1024px) {
        animation: bounce 3s ease-in-out infinite;
      }

      @media (max-width: 768px) {
        padding: 1.25rem;
        bottom: -25px;
      }
    }

    .logo-icon {
      color: white;
      font-size: 48px;
      width: 48px;
      height: 48px;

      @media (max-width: 768px) {
        font-size: 36px;
        width: 36px;
        height: 36px;
      }
    }

    .navbar-links {
      position: relative;
      z-index: 5;
      display: none;
      justify-content: space-between;
      gap: 3rem;
      margin-top: 0.5rem;
      width: 100%;
      padding: 0 4rem;

      @media (max-width: 1024px) {
        display: flex;
      }

      @media (max-width: 768px) {
        padding: 0 3rem;
        margin-top: 0.25rem;
      }

      @media (max-width: 480px) {
        padding: 0 2.5rem;
      }
    }

    .navbar-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-weight: bold;
      font-size: 1.1rem;
      transition: color 0.3s;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      z-index: 20;

      @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 0.25rem 0.75rem;
      }
    }

    .navbar-link:hover {
      color: white;
      background: rgba(6, 182, 212, 0.1);
    }

    .floating-words {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .floating-word {
      position: absolute;
      color: rgba(255, 255, 255, 0.1);
      font-size: 1rem;
      animation: randomFloat 8s ease-in-out infinite;
      white-space: nowrap;

      @media (max-width: 768px) {
        font-size: 0.8rem;
      }
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateX(-50%) translateY(0);
      }
      50% {
        transform: translateX(-50%) translateY(-10px);
      }
    }

    @keyframes randomFloat {
      0% {
        transform: translate(0, 0) rotate(0deg);
      }
      33% {
        transform: translate(30px, 30px) rotate(120deg);
      }
      66% {
        transform: translate(-20px, 20px) rotate(240deg);
      }
      100% {
        transform: translate(0, 0) rotate(360deg);
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  wordsList = [
    'Explore', 'Discover', 'Watch', 'Share', 'Create', 
    'Connect', 'Learn', 'Enjoy', 'Play', 'Stream',
    'View', 'Like', 'Subscribe', 'Comment', 'Engage'
  ];

  floatingWords: FloatingWord[] = [];

  ngOnInit() {
    this.floatingWords = this.wordsList.map(text => ({
      text,
      delay: `-${Math.random() * 10}s`,
      left: `${Math.random() * 80}%`,
      top: `${Math.random() * 80}%`
    }));
  }
}
